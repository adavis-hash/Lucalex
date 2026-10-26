import React from 'react';
import { ArrowUpRight, Box, Compass, Sparkles, Cpu } from 'lucide-react';
import { COLLECTIONS, CollectionItem } from '../data/products';

interface FeaturedCollectionsProps {
  collections?: CollectionItem[];
  onSelectCollection: (id: string) => void;
  selectedCollectionId: string | null;
}

export default function FeaturedCollections({
  collections = COLLECTIONS,
  onSelectCollection,
  selectedCollectionId,
}: FeaturedCollectionsProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'architecture': return <Box size={16} />;
      case 'space': return <Compass size={16} />;
      case 'engineering': return <Cpu size={16} />;
      case 'fantasy': return <Sparkles size={16} />;
      default: return <Box size={16} />;
    }
  };

  return (
    <section id="collections" className="section-padding" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-label">
            EXPLORE MODULAR WORLDS
          </div>
          <h2 className="section-title">
            Curated Building Universes
          </h2>
          <p className="section-subtitle">
            Every collection is developed on the MODULO Universal Grid, allowing cross-system compatibility between architectural forms, kinetic machines, and cosmic realms.
          </p>
        </div>

        {/* Collections Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {collections.map((col) => {
            const isSelected = selectedCollectionId === col.id;

            return (
              <div 
                key={col.id}
                onClick={() => onSelectCollection(col.id)}
                className="collection-card"
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#f8fafc',
                  border: `2px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 12px 30px rgba(37, 99, 235, 0.15)' : '0 4px 12px rgba(15, 23, 42, 0.04)'
                }}
              >
                {/* Image Container with Zoom effect on hover */}
                <div style={{
                  position: 'relative',
                  height: '240px',
                  overflow: 'hidden',
                  backgroundColor: '#0f172a'
                }}>
                  <img 
                    src={col.image} 
                    alt={col.name}
                    className="collection-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 60%)'
                  }} />

                  {/* Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {getIcon(col.id)}
                    <span>{col.featuredBadge}</span>
                  </div>

                  {/* Filter active marker */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      Active Filter
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      marginBottom: '8px',
                      fontFamily: "var(--font-space), 'Space Grotesk', sans-serif"
                    }}>
                      {col.name}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#64748b',
                      lineHeight: 1.5,
                      marginBottom: '18px'
                    }}>
                      {col.subtitle}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <span style={{
                      fontSize: '0.78125rem',
                      fontWeight: 600,
                      color: '#94a3b8'
                    }}>
                      {col.itemCount}
                    </span>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#2563eb'
                    }} className="card-action-link">
                      View Sets <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .collection-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 35px -5px rgba(15, 23, 42, 0.12);
        }
        .collection-card:hover .collection-img {
          transform: scale(1.06);
        }
        .collection-card:hover .card-action-link {
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
}
