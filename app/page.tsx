'use client';

import React, { useState, useEffect, useMemo } from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedCollections from '../components/FeaturedCollections';
import FeaturedProducts from '../components/FeaturedProducts';
import BrandStory from '../components/BrandStory';
import CommunitySection from '../components/CommunitySection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';
import QuickViewModal from '../components/QuickViewModal';
import CartDrawer from '../components/CartDrawer';
import SearchModal from '../components/SearchModal';
import { PRODUCTS, COLLECTIONS, ProductItem, CollectionItem } from '../data/products';
import { useCart } from '../context/CartContext';
import { createClient } from '../lib/supabase/client';
import { Database } from '../types/database.types';

type CollectionRow = Database['public']['Tables']['collections']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];

export default function Home() {
  const { cartItems, addToCart, cartOpen, setCartOpen } = useCart();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Catalog state initialized with static fallback, loaded dynamically from Supabase
  const [products, setProducts] = useState<ProductItem[]>(PRODUCTS);
  const [collections, setCollections] = useState<CollectionItem[]>(COLLECTIONS);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function loadSupabaseCatalog() {
      try {
        const [colRes, prodRes] = await Promise.all([
          supabase.from('collections').select('*').order('name'),
          supabase.from('products').select('*').order('created_at'),
        ]);

        if (colRes.data && colRes.data.length > 0) {
          setCollections(
            colRes.data.map((c: CollectionRow) => ({
              id: c.id,
              name: c.name,
              subtitle: c.subtitle || '',
              image: c.image,
              featuredBadge: c.featured_badge || '',
              itemCount: c.item_count || '',
              accentColor: c.accent_color || '#334155',
            }))
          );
        }

        if (prodRes.data && prodRes.data.length > 0) {
          setProducts(
            prodRes.data.map((p: ProductRow) => ({
              id: p.id,
              setNumber: p.set_number,
              name: p.name,
              collectionId: p.collection_id || '',
              collectionName: p.collection_name || '',
              pieces: p.pieces,
              age: p.age,
              price: Number(p.price),
              isNew: p.is_new,
              isFeatured: p.is_featured,
              badge: p.badge || undefined,
              image: p.image,
              tagline: p.tagline || '',
              dimensions: p.dimensions || '',
              features: Array.isArray(p.features) ? (p.features as string[]) : [],
              difficulty: p.difficulty || 'Intermediate',
            }))
          );
        }
      } catch (err) {
        console.warn('Supabase catalog fetch fallback used:', err);
      }
    }

    loadSupabaseCatalog();
  }, [supabase]);

  const handleSelectCollection = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    const el = document.getElementById('featured-sets');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInspectFlagship = () => {
    if (products.length > 0) {
      setQuickViewProduct(products[0]);
    }
  };

  return (
    <div className="modulo-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation Bar */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      {/* Main Content Sections */}
      <main style={{ flex: 1 }}>
        {/* 3. Hero Section */}
        <HeroSection 
          onExploreClick={() => {
            document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onDiscoverClick={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onInspectFlagship={handleInspectFlagship}
        />

        {/* 4. Featured Collections (Loaded from Supabase) */}
        <FeaturedCollections 
          collections={collections}
          onSelectCollection={handleSelectCollection}
          selectedCollectionId={selectedCollectionId}
        />

        {/* 5. Featured Products (Loaded from Supabase) */}
        <FeaturedProducts 
          products={products}
          onQuickView={(product) => setQuickViewProduct(product)}
          onAddToCart={addToCart}
          selectedCollectionId={selectedCollectionId}
          onResetCollectionFilter={() => setSelectedCollectionId(null)}
          cartItemIds={cartItems.map(item => item.id)}
        />

        {/* 6. Brand Story & Modular Philosophy */}
        <BrandStory />

        {/* 7. Community & Inspiration Guild */}
        <CommunitySection />

        {/* 8. Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* 9. Comprehensive Footer */}
      <Footer />

      {/* Interactive Overlays */}
      <QuickViewModal 
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
        inCart={quickViewProduct ? cartItems.some(i => i.id === quickViewProduct.id) : false}
      />

      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />

      <SearchModal 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(product) => setQuickViewProduct(product)}
        products={products}
      />
    </div>
  );
}
