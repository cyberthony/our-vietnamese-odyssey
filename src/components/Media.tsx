"use client";

import Image, { type ImageProps } from "next/image";

/**
 * URL de base du bucket R2, lue au build time.
 * NEXT_PUBLIC_ permet l'exposition côté client.
 */
const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL ?? "";

/**
 * Vérifie si une URL est absolue (externe).
 */
function isAbsoluteUrl(src: string): boolean {
  return /^(https?:)?\/\//i.test(src);
}

/**
 * Construit l'URL complète d'un asset :
 * - Si l'URL est déjà absolue → retournée telle quelle.
 * - Sinon → préfixée avec NEXT_PUBLIC_ASSETS_URL.
 */
export function assetUrl(src: string): string {
  if (!src) return "";
  if (isAbsoluteUrl(src)) return src;

  const base = ASSETS_URL.replace(/\/+$/, "");
  const path = src.replace(/^\/+/, "");
  return `${base}/${path}`;
}

// ── Image mode ────────────────────────────────────────────────

type MediaImageProps = {
  as?: "img";
} & Omit<ImageProps, "src"> & { src: string };

// ── Video mode ────────────────────────────────────────────────

type MediaVideoProps = {
  as: "video";
  src: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
} & React.ComponentPropsWithoutRef<"video">;

type MediaProps = MediaImageProps | MediaVideoProps;

/**
 * Composant Media — affiche une image (next/image) ou une vidéo.
 *
 * Images : utilise next/image avec le lazy-loading natif.
 * Vidéos : utilise la balise <video> HTML5.
 *
 * @example
 *   <Media src="hanoi.jpg" alt="Hanoi" width={800} height={600} />
 *   <Media src="hanoi.jpg" as="video" controls width={800} />
 *   <Media src="https://site.com/img.jpg" alt="Externe" width={400} height={300} />
 */
export default function Media(props: MediaProps) {
  const { src, as = "img" } = props;

  if (as === "video") {
    const { as: _as, src: _src, width, height, className, style, ...rest } = props as MediaVideoProps;
    return (
      <video
        src={assetUrl(src)}
        width={width}
        height={height}
        className={className}
        style={style}
        {...rest}
      />
    );
  }

  // Image mode
  const { as: _asImg, src: _srcImg, alt = "", priority = false, quality, ...rest } = props as MediaImageProps;
  return (
    <Image
      src={assetUrl(src)}
      alt={alt}
      priority={priority}
      quality={quality}
      unoptimized
      {...rest}
    />
  );
}
