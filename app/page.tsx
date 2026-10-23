'use client';

import React, { useState } from 'react';
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
import { PRODUCTS, ProductItem } from '../data/products';

export default function Home() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Initial demonstration item in the concept bag (flagship set)
  const [cartItems, setCartItems] = useState<ProductItem[]>([PRODUCTS[0]]);

  const handleAddToCart = (product: ProductItem) => {
    if (!cartItems.some(item => item.id === product.id)) {
      setCartItems(prev => [...prev, product]);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSelectCollection = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    // Smooth scroll down to featured sets grid
    const el = document.getElementById('featured-sets');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInspectFlagship = () => {
    setQuickViewProduct(PRODUCTS[0]);
  };

  return (
    <div className="modulo-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation Bar */}
      <Navbar 
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        cartCount={cartItems.length}
      />

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

        {/* 4. Featured Collections */}
        <FeaturedCollections 
          onSelectCollection={handleSelectCollection}
          selectedCollectionId={selectedCollectionId}
        />

        {/* 5. Featured Products */}
        <FeaturedProducts 
          onQuickView={(product) => setQuickViewProduct(product)}
          onAddToCart={handleAddToCart}
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
        onAddToCart={handleAddToCart}
        inCart={quickViewProduct ? cartItems.some(i => i.id === quickViewProduct.id) : false}
      />

      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      <SearchModal 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(product) => setQuickViewProduct(product)}
      />
    </div>
  );
}
