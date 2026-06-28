import { PostMetadata } from "@/lib/mdx";

export interface PostData {
  metadata: PostMetadata;
  content: string;
}

export const postsData: Record<string, PostData> = {
  "premiers-pas-seoul": {
    metadata: {
      title: "Premiers pas dans l'effervescence de Séoul",
      excerpt: "Notre aventure commence au cœur de Myeongdong. Entre gratte-ciels futuristes et temples centenaires, les enfants découvrent un nouveau monde.",
      date: "01 Juillet 2026",
      location: "Séoul, Corée",
      country: "korea",
      imageUrl: "IMG_20240702_195808.jpg",
      readTime: "4 min",
      slug: "premiers-pas-seoul",
    },
    content: `
Après un long vol depuis Paris, nous y voilà enfin. Le souffle chaud de l'été séoulite nous accueille à la sortie de l'aéroport d'Incheon. Émilie et Yaya, bien que fatigués par le décalage horaire, ouvrent des yeux grands comme des soucoupes devant la hauteur des panneaux lumineux.

Notre hôtel, le *The Stay Classic Hotel Myeongdong*, s'avère être un camp de base idéal. Dès le premier soir, nous nous enfonçons dans les ruelles animées du quartier de Myeongdong, réputé pour sa cuisine de rue ("street food").

### Nos premières découvertes :
- **Les brochettes de Tteokbokki** : Ces gâteaux de riz glissants nappés d'une sauce piquante rouge vif. Yaya a adoré la texture élastique, Émilie a trouvé cela un peu trop fort pour son palais délicat !
- **Le Temple Jogyesa** : Le lendemain matin, nous avons visité ce temple bouddhiste en plein centre-ville. Les lanternes multicolores suspendues au-dessus de nos têtes créaient un dôme de couleur féérique.

Nous passons l'après-midi à arpenter les ruelles calmes du village traditionnel de *Bukchon Hanok*, admirant les toits incurvés en tuiles sombres. Le contraste entre ces maisons en bois préservées et la silhouette moderne de la N Seoul Tower au loin est saisissant.

Séoul nous séduit déjà par son calme apparent malgré l'immensité de sa population. Les transports sont d'une propreté exemplaire, et les gens d'une politesse remarquable. Une entrée en matière parfaite pour notre Odyssey !
    `.trim()
  },
  "danang-pont-du-dragon": {
    metadata: {
      title: "Da Nang et son incroyable Pont du Dragon",
      excerpt: "Entre plages de sable blanc et montagnes sacrées, Da Nang nous accueille pour trois jours de détente. Le clou du spectacle : le Pont du Dragon qui crache du feu.",
      date: "10 Juillet 2026",
      location: "Da Nang, Vietnam",
      country: "vietnam",
      imageUrl: "IMG_20240714_122039.jpg",
      readTime: "5 min",
      slug: "danang-pont-du-dragon",
    },
    content: `
Après notre escale à Hoi An, nous reprenons la route côtière pour Da Nang. La ville se dresse, moderne, le long de la rivière Han, flanquée de longues plages de sable blanc qui n'ont rien à envier aux plus belles cartes postales.

Nous posons nos valises à l'*Elite Riverlight Boutique Hotel*, idéalement situé près des ponts suspendus.

### Ce que nous avons adoré :
1. **Les Montagnes de Marbre** : Un réseau de grottes bouddhistes taillées dans la roche calcaire. La montée des marches sous la chaleur est rude, mais la vue panoramique sur la mer et la baie en vaut chaque goutte de sueur.
2. **Le spectacle du Dragon** : Le samedi soir à 21h00 pile, le gigantesque dragon doré métallique sculpté sur le pont se met à cracher d'immenses flammes de feu, suivies de jets d'eau sous les acclamations de la foule massée le long des quais. Les enfants étaient émerveillés !

Da Nang offre une ambiance balnéaire dynamique, très différente du calme pittoresque de Hoi An. C'est une ville jeune où il fait bon flâner le long de la mer en dégustant des jus de noix de coco frais. Une étape intermédiaire parfaite avant de monter vers la cité impériale de Huế.
    `.trim()
  }
};
