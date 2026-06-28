/**
 * upload-to-r2.mjs
 *
 * Upload récursif de public/images/ vers un bucket Cloudflare R2.
 * Vérifie l'existence de chaque fichier (via HeadObject) pour éviter
 * les doublons — seul un fichier nouveau ou de taille différente est uploadé.
 *
 * Usage :
 *   1. Copier .env.r2.example → .env.r2 et remplir les credentials
 *   2. Placer les images dans public/images/
 *   3. npm run upload-r2
 *
 * Prérequis : @aws-sdk/client-s3 (devDependency)
 */

import { readFileSync, existsSync } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { join, relative, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

// ─── Configuration ───────────────────────────────────────────
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SCRIPT_DIR, '..')
const IMAGES_DIR = join(ROOT, 'public', 'images')
const ENV_FILE = join(ROOT, '.env.r2')

// Chargement des variables d'environnement depuis .env.r2
if (existsSync(ENV_FILE)) {
  const envContent = readFileSync(ENV_FILE, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

const {
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_ENDPOINT,
  R2_BUCKET,
  R2_PUBLIC_URL,
} = process.env

// Validation
const missing = []
if (!R2_ACCESS_KEY_ID) missing.push('R2_ACCESS_KEY_ID')
if (!R2_SECRET_ACCESS_KEY) missing.push('R2_SECRET_ACCESS_KEY')
if (!R2_ENDPOINT) missing.push('R2_ENDPOINT')
if (!R2_BUCKET) missing.push('R2_BUCKET')
if (missing.length > 0) {
  console.error(`❌ Variables manquantes dans .env.r2 : ${missing.join(', ')}`)
  process.exit(1)
}

// ─── Client S3 (compatible R2) ────────────────────────────────
const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  // Forcer le style path (pas de DNS virtual-host) pour la compatibilité R2
  forcePathStyle: false,
})

// ─── Helpers ──────────────────────────────────────────────────

/**
 * Vérifie si un objet existe déjà sur R2 et retourne sa taille.
 * Retourne -1 si l'objet n'existe pas.
 */
async function headObject(key) {
  try {
    const res = await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }))
    return res.ContentLength ?? -1
  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      return -1
    }
    throw err
  }
}

/**
 * Devine le ContentType à partir de l'extension.
 */
function mimeType(filePath) {
  const ext = filePath.split('.').pop()?.toLowerCase()
  const map = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    ico: 'image/x-icon',
    pdf: 'application/pdf',
  }
  return map[ext] || 'application/octet-stream'
}

/**
 * Parcourt un dossier récursivement et retourne la liste des chemins absolus.
 */
async function walk(dir) {
  const files = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full)))
    } else if (entry.isFile()) {
      // Ignorer les fichiers cachés
      if (!entry.name.startsWith('.')) {
        files.push(full)
      }
    }
  }
  return files
}

/**
 * Formate une taille en bytes pour l'affichage.
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

// ─── Main ─────────────────────────────────────────────────────

async function main() {
  if (!existsSync(IMAGES_DIR)) {
    console.error(`❌ Dossier introuvable : ${IMAGES_DIR}`)
    console.error('   Crée le dossier public/images/ et ajoutes-y tes médias.')
    process.exit(1)
  }

  const localFiles = await walk(IMAGES_DIR)
  if (localFiles.length === 0) {
    console.log('📭 Aucun fichier trouvé dans public/images/ — rien à uploader.')
    return
  }

  console.log(`\n📦 Bucket         : ${R2_BUCKET}`)
  console.log(`📂 Fichiers locaux : ${localFiles.length}`)
  console.log(`🔗 URL publique    : ${R2_PUBLIC_URL || '(non définie)'}`)
  console.log('')

  let uploaded = 0
  let skipped = 0
  let errors = 0
  let totalSize = 0

  for (const localPath of localFiles) {
    const key = relative(IMAGES_DIR, localPath).replace(/\\/g, '/') // normalise pour S3
    const localStat = await stat(localPath)
    const label = `  ${key}`

    try {
      const remoteSize = await headObject(key)

      if (remoteSize === localStat.size) {
        console.log(`⏭️  SKIP (identique) : ${label}`)
        skipped++
        continue
      }

      if (remoteSize !== -1) {
        console.log(`🔄  MÀJ  (${formatSize(remoteSize)} → ${formatSize(localStat.size)}) : ${label}`)
      } else {
        console.log(`⬆️  UPLOAD (${formatSize(localStat.size)}) : ${label}`)
      }

      const body = readFileSync(localPath)
      await s3.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET,
          Key: key,
          Body: body,
          ContentType: mimeType(localPath),
        })
      )

      uploaded++
      totalSize += localStat.size
    } catch (err) {
      console.error(`❌ ERREUR : ${label}`)
      console.error(`   ${err.message}`)
      errors++
    }
  }

  // ─── Résumé ──────────────────────────────────────────────────
  console.log('')
  console.log('═══════════════════════════════════════════')
  console.log(`✅ Upload terminé`)
  console.log(`   ⬆️  Uploadés : ${uploaded}`)
  console.log(`   ⏭️  Ignorés   : ${skipped}`)
  console.log(`   ❌ Erreurs   : ${errors}`)
  console.log(`   📦 Total     : ${formatSize(totalSize)}`)
  if (R2_PUBLIC_URL) {
    console.log('')
    console.log('🌐 URLs générées (à utiliser avec <Media src="...">) :')
    console.log(`   Base : ${R2_PUBLIC_URL}/`)
    for (const f of localFiles.slice(0, 5)) {
      const key = relative(IMAGES_DIR, f).replace(/\\/g, '/')
      console.log(`   → ${R2_PUBLIC_URL}/${key}`)
    }
    if (localFiles.length > 5) {
      console.log(`   ... et ${localFiles.length - 5} autres`)
    }
  }
  console.log('═══════════════════════════════════════════')
}

main().catch((err) => {
  console.error('💥 Erreur fatale :', err.message)
  process.exit(1)
})
