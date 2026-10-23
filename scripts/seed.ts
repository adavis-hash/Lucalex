/**
 * Optional programmatic seed script for Supabase
 * Usage:
 *   npx tsx scripts/seed.ts
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { COLLECTIONS, PRODUCTS } from '../data/products';
import { Database } from '../types/database.types';

type CollectionInsert = Database['public']['Tables']['collections']['Insert'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      'Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment to run seed.'
    );
    process.exit(1);
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);
  console.log('Seeding collections...');

  const collectionRecords: CollectionInsert[] = COLLECTIONS.map((col) => ({
    id: col.id,
    name: col.name,
    subtitle: col.subtitle,
    image: col.image,
    featured_badge: col.featuredBadge,
    item_count: col.itemCount,
    accent_color: col.accentColor,
  }));

  const { error: colError } = await supabase
    .from('collections')
    .upsert(collectionRecords);

  if (colError) {
    console.error('Failed to upsert collections:', colError.message);
  } else {
    console.log(`Seeded ${collectionRecords.length} collections.`);
  }

  console.log('Seeding products...');
  const productRecords: ProductInsert[] = PRODUCTS.map((prod) => ({
    id: prod.id,
    set_number: prod.setNumber,
    name: prod.name,
    collection_id: prod.collectionId,
    collection_name: prod.collectionName,
    pieces: prod.pieces,
    age: prod.age,
    price: prod.price,
    is_new: prod.isNew,
    is_featured: prod.isFeatured,
    badge: prod.badge || null,
    image: prod.image,
    tagline: prod.tagline,
    dimensions: prod.dimensions,
    features: prod.features,
    difficulty: prod.difficulty,
    stock: 50,
  }));

  const { error: prodError } = await supabase
    .from('products')
    .upsert(productRecords);

  if (prodError) {
    console.error('Failed to upsert products:', prodError.message);
  } else {
    console.log(`Seeded ${productRecords.length} products.`);
  }

  console.log('Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Seed exception:', err);
  process.exit(1);
});
