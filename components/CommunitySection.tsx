import React from 'react';
import { Camera, Compass, Award, Sparkles, Heart } from 'lucide-react';

export default function CommunitySection() {
  const communityBuilds = [
    {
      title: 'Nordic Modular Cliff Villa',
      builder: 'Elena R. • Copenhagen',
      pieces: '3,450 pcs',
      category: 'Architecture',
      tag: 'Staff Favorite'
    },
    {
      title: 'Solar Wind Orbital Array',
      builder: 'Marcus K. • Tokyo',
      pieces: '1,890 pcs',
      category: 'Deep Space',
      tag: 'Blueprint Winner'
    },
    {
      title: 'Kinetic Clockwork Locomotive',
      builder: 'David & Leo • Berlin',
      pieces: '2,670 pcs',
      category: 'Engineering',
      tag: 'Community Pick'
    }
  ];

  return (
    <section id="community" className="section-padding" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="section-label" style={{ color: '#059669', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
            <Sparkles size={14} /> THE BUILDERS LAB
          </div>
          <h2 className="section-title">
            Inspiration & Community Guild
          </h2>
          <p className="section-subtitle">
            A future gathering space for architects, industrial designers, and passion builders to publish custom blueprints, share mods, and test open modular prototypes.
          </p>
        </div>

        {/* Feature Split Showcase */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '56px'
        }}>
          {/* Left: Lifestyle Image */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <img 
              src="/images/community_showcase.jpg" 
              alt="Community Builder Studio Workspace with MODULO Blueprints" 
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              padding: '14px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(6px)',
              color: '#ffffff',
              fontSize: '0.8125rem'
            }}>
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>Community Spotlight: </span>
              Architect Sarah Jenkins prototyping the Modular Housing Grid in her Chicago studio.
            </div>
          </div>

          {/* Right: Community Guild Pillars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              padding: '24px',
              borderRadius: '14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Award size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                  Monthly Blueprint Challenges
                </h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                Submit original digital blueprints or physical builds under monthly design briefs. Selected creator designs will be packaged into limited Community Box sets.
              </p>
            </div>

            <div style={{
              padding: '24px',
              borderRadius: '14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Compass size={20} color="#f59e0b" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                  Open Geometry System (OGS)
                </h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                Download official CAD files, step guides, and 3D printing templates for custom adapter joints compatible with the MODULO universal grid standard.
              </p>
            </div>

            <div style={{
              padding: '24px',
              borderRadius: '14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Camera size={20} color="#059669" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                  Global Builder Gallery
                </h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                Tag your creations with <strong>#ModuloCraft</strong> to be featured on our frontpage and in our bi-weekly printed builder journal.
              </p>
            </div>
          </div>
        </div>

        {/* Prototype Community Showcase Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {communityBuilds.map((build, index) => (
            <div 
              key={index}
              style={{
                padding: '20px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#2563eb',
                    backgroundColor: '#eff6ff',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    {build.tag}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {build.pieces}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  {build.title}
                </h4>

                <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  By {build.builder}
                </p>
              </div>

              <div style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {build.category}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#64748b'
                }}>
                  <Heart size={13} color="#ef4444" fill="#ef4444" /> Concept
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
