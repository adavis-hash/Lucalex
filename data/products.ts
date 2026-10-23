/**
 * MODULO Product & Collection Dataset (Demonstration Phase 1)
 * All products and prices are fictional concept prototypes.
 */

export interface CollectionItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  featuredBadge: string;
  itemCount: string;
  accentColor: string;
}

export interface ProductItem {
  id: string;
  setNumber: string;
  name: string;
  collectionId: string;
  collectionName: string;
  pieces: number;
  age: string;
  price: number;
  isNew: boolean;
  isFeatured: boolean;
  badge?: string;
  image: string;
  tagline: string;
  dimensions: string;
  features: string[];
  difficulty: string;
}

export interface BrandPillar {
  number: string;
  title: string;
  description: string;
}

export const COLLECTIONS: CollectionItem[] = [
  {
    id: 'architecture',
    name: 'Architecture & Cities',
    subtitle: 'Brutalist towers, urban pavilions, and mid-century modular spaces.',
    image: '/images/col_architecture.jpg',
    featuredBadge: 'Series 01',
    itemCount: '6 Concept Sets',
    accentColor: '#334155'
  },
  {
    id: 'space',
    name: 'Space & Exploration',
    subtitle: 'Orbital rovers, deep-space survey vessels, and lunar habitats.',
    image: '/images/col_space.jpg',
    featuredBadge: 'Deep Cosmos',
    itemCount: '5 Concept Sets',
    accentColor: '#1e3a8a'
  },
  {
    id: 'engineering',
    name: 'Vehicles & Engineering',
    subtitle: 'Kinetic hypercars, functional gearboxes, and aerodynamic chassis.',
    image: '/images/col_engineering.jpg',
    featuredBadge: 'Kinetic Labs',
    itemCount: '4 Concept Sets',
    accentColor: '#ea580c'
  },
  {
    id: 'fantasy',
    name: 'Fantasy & Adventure',
    subtitle: 'Floating citadels, mythic sanctuaries, and crystal waterfall towers.',
    image: '/images/col_fantasy.jpg',
    featuredBadge: 'Mythic Realms',
    itemCount: '4 Concept Sets',
    accentColor: '#059669'
  }
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'set-01',
    setNumber: 'MOD-0101',
    name: 'The Biosphera Geodesic Pavilion',
    collectionId: 'architecture',
    collectionName: 'Architecture & Cities',
    pieces: 2840,
    age: '16+',
    price: 219.00,
    isNew: true,
    isFeatured: true,
    badge: 'Flagship Edition',
    image: '/images/hero_showcase.jpg',
    tagline: 'An intricate architectural conservatory featuring amber geodesic glass, elevated walkways, and botanical interior modules.',
    dimensions: '44 cm (W) × 32 cm (D) × 28 cm (H)',
    features: [
      'Removable geodesic dome canopy with solar-tinted facets',
      'Dual cantilevered observation ramps and perimeter gallery',
      'Integrated botanical greenhouse with 48 miniature flora elements',
      'Solid architectural concrete-textured display plinth with metal plaque'
    ],
    difficulty: 'Advanced Master'
  },
  {
    id: 'set-02',
    setNumber: 'MOD-0102',
    name: 'Brutalist Tower Complex No. 12',
    collectionId: 'architecture',
    collectionName: 'Architecture & Cities',
    pieces: 1980,
    age: '14+',
    price: 169.00,
    isNew: true,
    isFeatured: true,
    badge: 'Architect Series',
    image: '/images/col_architecture.jpg',
    tagline: 'Sculptural modular high-rise exploring geometric cantilevers, exposed staircase shafts, and warm cedar-toned balcony modules.',
    dimensions: '26 cm (W) × 24 cm (D) × 42 cm (H)',
    features: [
      'Modular stacking floor sections with interchangeable balconies',
      'Authentic micro-groove concrete aesthetic with matte finish',
      'Internal elevator shaft mechanism with tactile friction stop',
      'Engraved baseplate commemorating mid-century modernist forms'
    ],
    difficulty: 'Advanced'
  },
  {
    id: 'set-03',
    setNumber: 'MOD-0201',
    name: 'Cosmos Lunar Rover & Orbital Survey Craft',
    collectionId: 'space',
    collectionName: 'Space & Exploration',
    pieces: 1420,
    age: '12+',
    price: 129.00,
    isNew: false,
    isFeatured: true,
    badge: 'Cosmos Labs',
    image: '/images/col_space.jpg',
    tagline: 'Dual-vehicle exploration module with articulating 6-wheel terrain suspension, deployable solar wings, and high-altitude cockpit.',
    dimensions: 'Rover: 22 cm × 16 cm | Craft: 28 cm × 24 cm',
    features: [
      'Independent rocker-bogie all-terrain suspension system',
      'Gold thermal-shield foil elements and cyan UV-tinted cockpits',
      'Articulated robotic recovery arm with functional claw grip',
      'Dual display stands for terrestrial and flight pose presentation'
    ],
    difficulty: 'Intermediate'
  },
  {
    id: 'set-04',
    setNumber: 'MOD-0301',
    name: 'Apex Kinetic Hypercar GT (1:12 Scale)',
    collectionId: 'engineering',
    collectionName: 'Vehicles & Engineering',
    pieces: 2240,
    age: '16+',
    price: 189.00,
    isNew: true,
    isFeatured: true,
    badge: 'Precision Engineering',
    image: '/images/col_engineering.jpg',
    tagline: 'Track-focused aerodynamic hypercar featuring exposed modular pushrod suspension, working differential gears, and active rear aero.',
    dimensions: '48 cm (L) × 22 cm (W) × 13 cm (H)',
    features: [
      'Functional 6-speed paddle-shift sequential gearbox with visible gears',
      'Double-wishbone pushrod suspension with calibrated damping springs',
      'Gullwing doors and opening aerodynamic rear clam engine cover',
      'Removable carbon-weave textured body panels for chassis inspection'
    ],
    difficulty: 'Advanced Master'
  },
  {
    id: 'set-05',
    setNumber: 'MOD-0401',
    name: 'Aetheria Skylands Sanctuary',
    collectionId: 'fantasy',
    collectionName: 'Fantasy & Adventure',
    pieces: 3120,
    age: '16+',
    price: 249.00,
    isNew: false,
    isFeatured: false,
    badge: 'Mythic Series',
    image: '/images/col_fantasy.jpg',
    tagline: 'A floating mythical mountain citadel with cascading crystal clear waterfalls, illuminated amber lanterns, and ancient stone archways.',
    dimensions: '38 cm (W) × 34 cm (D) × 52 cm (H)',
    features: [
      'Hidden tension-wire levitation system creating authentic floating island illusion',
      'Cascading translucent aquamarine waterfalls with water-ripple base',
      'Detailed interior sanctuary with alchemy desk, scroll library, and telescope',
      'Warm micro-glow light conduits illuminating the central tower rotunda'
    ],
    difficulty: 'Master Collector'
  }
];

export const BRAND_PILLARS: BrandPillar[] = [
  {
    number: '01',
    title: 'Sub-Millimeter Friction Tolerances',
    description: 'Every MODULO block is engineered to a ±0.003mm precision standard, delivering an unmistakably crisp, satisfying tactile click with rock-solid architectural stability.'
  },
  {
    number: '02',
    title: 'Universal Modular Geometry',
    description: 'An open geometric coordinate grid connects every series. An architectural skyscraper integrates naturally with kinetic mechanics and planetary exploration habitats.'
  },
  {
    number: '03',
    title: 'Matte Bio-Composite Formulations',
    description: 'Crafted with premium plant-derived polymers that eliminate plastic glare, offering a luxurious velvet touch and museum-grade color depth worthy of display.'
  }
];
