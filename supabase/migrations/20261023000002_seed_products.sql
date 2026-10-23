-- ==============================================================================
-- Migration: 20261023000002_seed_products.sql
-- Description: Seed initial collections and products data for MODULO storefront
-- ==============================================================================

-- 1. SEED COLLECTIONS
INSERT INTO public.collections (id, name, subtitle, image, featured_badge, item_count, accent_color)
VALUES
  (
    'architecture',
    'Architecture & Cities',
    'Brutalist towers, urban pavilions, and mid-century modular spaces.',
    '/images/col_architecture.jpg',
    'Series 01',
    '6 Concept Sets',
    '#334155'
  ),
  (
    'space',
    'Space & Exploration',
    'Orbital rovers, deep-space survey vessels, and lunar habitats.',
    '/images/col_space.jpg',
    'Deep Cosmos',
    '5 Concept Sets',
    '#1e3a8a'
  ),
  (
    'engineering',
    'Vehicles & Engineering',
    'Kinetic hypercars, functional gearboxes, and aerodynamic chassis.',
    '/images/col_engineering.jpg',
    'Kinetic Labs',
    '4 Concept Sets',
    '#ea580c'
  ),
  (
    'fantasy',
    'Fantasy & Adventure',
    'Floating citadels, mythic sanctuaries, and crystal waterfall towers.',
    '/images/col_fantasy.jpg',
    'Mythic Realms',
    '4 Concept Sets',
    '#059669'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  image = EXCLUDED.image,
  featured_badge = EXCLUDED.featured_badge,
  item_count = EXCLUDED.item_count,
  accent_color = EXCLUDED.accent_color;

-- 2. SEED PRODUCTS
INSERT INTO public.products (
  id, set_number, name, collection_id, collection_name,
  pieces, age, price, is_new, is_featured, badge,
  image, tagline, dimensions, features, difficulty, stock
)
VALUES
  (
    'set-01',
    'MOD-0101',
    'The Biosphera Geodesic Pavilion',
    'architecture',
    'Architecture & Cities',
    2840,
    '16+',
    219.00,
    true,
    true,
    'Flagship Edition',
    '/images/hero_showcase.jpg',
    'An intricate architectural conservatory featuring amber geodesic glass, elevated walkways, and botanical interior modules.',
    '44 cm (W) × 32 cm (D) × 28 cm (H)',
    '[
      "Removable geodesic dome canopy with solar-tinted facets",
      "Dual cantilevered observation ramps and perimeter gallery",
      "Integrated botanical greenhouse with 48 miniature flora elements",
      "Solid architectural concrete-textured display plinth with metal plaque"
    ]'::jsonb,
    'Advanced Master',
    50
  ),
  (
    'set-02',
    'MOD-0102',
    'Brutalist Tower Complex No. 12',
    'architecture',
    'Architecture & Cities',
    1980,
    '14+',
    169.00,
    true,
    true,
    'Architect Series',
    '/images/col_architecture.jpg',
    'Sculptural modular high-rise exploring geometric cantilevers, exposed staircase shafts, and warm cedar-toned balcony modules.',
    '26 cm (W) × 24 cm (D) × 42 cm (H)',
    '[
      "Modular stacking floor sections with interchangeable balconies",
      "Authentic micro-groove concrete aesthetic with matte finish",
      "Internal elevator shaft mechanism with tactile friction stop",
      "Engraved baseplate commemorating mid-century modernist forms"
    ]'::jsonb,
    'Advanced',
    75
  ),
  (
    'set-03',
    'MOD-0201',
    'Cosmos Lunar Rover & Orbital Survey Craft',
    'space',
    'Space & Exploration',
    1420,
    '12+',
    129.00,
    false,
    true,
    'Cosmos Labs',
    '/images/col_space.jpg',
    'Dual-vehicle exploration module with articulating 6-wheel terrain suspension, deployable solar wings, and high-altitude cockpit.',
    'Rover: 22 cm × 16 cm | Craft: 28 cm × 24 cm',
    '[
      "Independent rocker-bogie all-terrain suspension system",
      "Gold thermal-shield foil elements and cyan UV-tinted cockpits",
      "Articulated robotic recovery arm with functional claw grip",
      "Dual display stands for terrestrial and flight pose presentation"
    ]'::jsonb,
    'Intermediate',
    100
  ),
  (
    'set-04',
    'MOD-0301',
    'Apex Kinetic Hypercar GT (1:12 Scale)',
    'engineering',
    'Vehicles & Engineering',
    2240,
    '16+',
    189.00,
    true,
    true,
    'Precision Engineering',
    '/images/col_engineering.jpg',
    'Track-focused aerodynamic hypercar featuring exposed modular pushrod suspension, working differential gears, and active rear aero.',
    '48 cm (L) × 22 cm (W) × 13 cm (H)',
    '[
      "Functional 6-speed paddle-shift sequential gearbox with visible gears",
      "Double-wishbone pushrod suspension with calibrated damping springs",
      "Gullwing doors and opening aerodynamic rear clam engine cover",
      "Removable carbon-weave textured body panels for chassis inspection"
    ]'::jsonb,
    'Advanced Master',
    60
  ),
  (
    'set-05',
    'MOD-0401',
    'Aetheria Skylands Sanctuary',
    'fantasy',
    'Fantasy & Adventure',
    3120,
    '16+',
    249.00,
    false,
    false,
    'Mythic Series',
    '/images/col_fantasy.jpg',
    'A floating mythical mountain citadel with cascading crystal clear waterfalls, illuminated amber lanterns, and ancient stone archways.',
    '38 cm (W) × 34 cm (D) × 52 cm (H)',
    '[
      "Hidden tension-wire levitation system creating authentic floating island illusion",
      "Cascading translucent aquamarine waterfalls with water-ripple base",
      "Detailed interior sanctuary with alchemy desk, scroll library, and telescope",
      "Warm micro-glow light conduits illuminating the central tower rotunda"
    ]'::jsonb,
    'Master Collector',
    40
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  set_number = EXCLUDED.set_number,
  collection_id = EXCLUDED.collection_id,
  collection_name = EXCLUDED.collection_name,
  pieces = EXCLUDED.pieces,
  age = EXCLUDED.age,
  price = EXCLUDED.price,
  is_new = EXCLUDED.is_new,
  is_featured = EXCLUDED.is_featured,
  badge = EXCLUDED.badge,
  image = EXCLUDED.image,
  tagline = EXCLUDED.tagline,
  dimensions = EXCLUDED.dimensions,
  features = EXCLUDED.features,
  difficulty = EXCLUDED.difficulty,
  stock = EXCLUDED.stock;
