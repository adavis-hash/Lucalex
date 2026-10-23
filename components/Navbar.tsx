'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronDown, Compass, Box, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenCart: () => void;
  cartCount?: number;
}

export default function Navbar({ onOpenSearch, onOpenCart, cartCount = 1 }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : '#ffffff',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${isScrolled ? 'rgba(15, 23, 42, 0.08)' : 'rgba(15, 23, 42, 0.05)'}`,
        boxShadow: isScrolled ? '0 4px 20px rgba(15, 23, 42, 0.06)' : 'none',
        transition: 'all 250ms ease'
      }}>
        <div className="container" style={{
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          {/* Brand Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
            <BrandLogo />
          </a>

          {/* Desktop Navigation Links */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '32px'
          }} className="desktop-nav">
            <a href="#" className="nav-link nav-link-active">Home</a>
            
            <a href="#featured-sets" className="nav-link">Shop</a>
            
            {/* Collections Dropdown */}
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setCollectionsDropdownOpen(true)}
              onMouseLeave={() => setCollectionsDropdownOpen(false)}
            >
              <a 
                href="#collections" 
                className="nav-link" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                Collections <ChevronDown size={14} style={{
                  transform: collectionsDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease'
                }} />
              </a>

              {collectionsDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '-20px',
                  paddingTop: '12px',
                  width: '260px',
                  zIndex: 100
                }}>
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)',
                    border: '1px solid #e2e8f0',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <a href="#collections" className="dropdown-item">
                      <Box size={16} color="#2563eb" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Architecture & Cities</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Modernist and urban forms</div>
                      </div>
                    </a>
                    <a href="#collections" className="dropdown-item">
                      <Compass size={16} color="#0284c7" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Space & Exploration</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Rovers and orbital vessels</div>
                      </div>
                    </a>
                    <a href="#collections" className="dropdown-item">
                      <Sparkles size={16} color="#ea580c" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Vehicles & Engineering</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Kinetic hypercars & gears</div>
                      </div>
                    </a>
                    <a href="#collections" className="dropdown-item">
                      <Box size={16} color="#059669" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Fantasy & Adventure</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Mythic crystal citadels</div>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="#themes" className="nav-link">Themes</a>
            <a href="#about" className="nav-link">About Us</a>
          </nav>

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Search Button */}
            <button 
              onClick={onOpenSearch}
              aria-label="Search sets and collections"
              className="icon-btn"
              title="Search catalog"
            >
              <Search size={20} />
            </button>

            {/* Shopping Bag Button (Demonstration Placeholder) */}
            <button 
              onClick={onOpenCart}
              aria-label="View shopping bag"
              className="icon-btn"
              style={{ position: 'relative' }}
              title="Shopping bag preview"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.4)'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="icon-btn mobile-toggle"
              style={{ display: 'none' }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '114px',
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)',
          zIndex: 89,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <a 
            href="#" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}
          >
            Home
          </a>
          <a 
            href="#featured-sets" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, fontSize: '1rem', color: '#334155' }}
          >
            Shop All Sets
          </a>
          <a 
            href="#collections" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, fontSize: '1rem', color: '#334155' }}
          >
            Collections (Architecture, Space, Vehicles, Fantasy)
          </a>
          <a 
            href="#themes" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, fontSize: '1rem', color: '#334155' }}
          >
            Themes & Master Builder Series
          </a>
          <a 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, fontSize: '1rem', color: '#334155' }}
          >
            About MODULO Philosophy
          </a>
          <div style={{ paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCart();
              }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <ShoppingBag size={18} /> View Concept Bag ({cartCount})
            </button>
          </div>
        </div>
      )}

      {/* Component Styles */}
      <style>{`
        .desktop-nav {
          display: flex !important;
        }
        .nav-link {
          font-weight: 600;
          font-size: 0.9375rem;
          color: #475569;
          transition: color 150ms ease;
          position: relative;
          padding: 8px 0;
        }
        .nav-link:hover {
          color: #0f172a;
        }
        .nav-link-active {
          color: #0f172a;
        }
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #2563eb;
          border-radius: 2px;
        }
        .icon-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #334155;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: all 150ms ease;
        }
        .icon-btn:hover {
          background-color: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
          transform: translateY(-1px);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          transition: background-color 150ms ease;
          color: #0f172a;
        }
        .dropdown-item:hover {
          background-color: #f1f5f9;
        }
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
