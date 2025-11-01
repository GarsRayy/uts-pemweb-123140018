import React from 'react';

// Helper component
function StatCard({ icon, color, bgColor, borderColor, label, value, subtitle, darkMode, textColor, textSecondary }) {
  return (
    <div style={{
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '0.75rem',
      padding: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: darkMode ? '#1f2937' : borderColor, // Disesuaikan sedikit
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg style={{ width: '20px', height: '20px', color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
      </div>
      <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: textColor }}>{value}</p>
      <p style={{ fontSize: '0.875rem', color: textSecondary, marginTop: '0.25rem' }}>{subtitle}</p>
    </div>
  );
}

// Komponen "About" (dari snippet baru)
// Komponen ini juga menggunakan inline style
function AboutSection({ darkMode, textColor, textSecondary }) {
  
  // Definisikan warna di sini agar tidak perlu pass terlalu banyak prop
  const cardBgColor = darkMode ? '#111827' : '#fff7ed';
  const cardBorderColor = darkMode ? '#1f2937' : '#fed7aa';
  const iconBgColor = darkMode ? '#1f2937' : '#ffedd5';
  const mainTextColor = darkMode ? '#d1d5db' : '#374151';

  return (
    <Container as="section" className="my-4"> {/* Menggunakan Container Bootstrap */}
      <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: textColor, marginBottom: '1rem' }}>
        Tentang Metropolitan Museum
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Main Info Card */}
        <div style={{ gridColumn: 'span 1' }}>
          <div style={{
            backgroundColor: cardBgColor,
            border: `1px solid ${cardBorderColor}`,
            borderRadius: '0.75rem',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: iconBgColor,
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg style={{ width: '24px', height: '24px', color: '#ea580c' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'Georgia, serif', fontWeight: 'bold', color: textColor, marginBottom: '0.75rem' }}>
                  Metropolitan Museum of Art
                </h3>
                <p style={{ color: mainTextColor, lineHeight: '1.6' }}>
                  Salah satu museum seni terbesar dan paling terkenal di dunia, berlokasi di Fifth Avenue, New York City. Dengan koleksi lebih dari 375,000 karya seni, kami menyajikan karya dari berbagai era, budaya, dan medium.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      Didirikan
                    </p>
                    <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: textColor }}>
                      1870
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '600', color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      Lokasi
                    </p>
                    <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: textColor }}>
                      New York
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <StatCard
            icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            color="#ef4444"
            bgColor={darkMode ? '#111827' : '#fef2f2'}
            borderColor={darkMode ? '#1f2937' : '#fecaca'}
            label="Pengunjung"
            value="6M+"
            subtitle="Per tahun"
            darkMode={darkMode}
            textColor={textColor}
            textSecondary={textSecondary}
          />
          <StatCard
            icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            color="#ea580c"
            bgColor={darkMode ? '#111827' : '#fff7ed'}
            borderColor={darkMode ? '#1f2937' : '#fed7aa'}
            label="Koleksi"
            value="375K+"
            subtitle="Karya seni"
            darkMode={darkMode}
            textColor={textColor}
            textSecondary={textSecondary}
          />
          <StatCard
            icon="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            color="#3b82f6"
            bgColor={darkMode ? '#111827' : '#eff6ff'}
            borderColor={darkMode ? '#1f2937' : '#bfdbfe'}
            label="Akses"
            value="Online"
            subtitle="API terbuka"
            darkMode={darkMode}
            textColor={textColor}
            textSecondary={textSecondary}
          />
        </div>
      </div>
    </Container>
  );
}

// Perlu import Container dari react-bootstrap
import { Container } from 'react-bootstrap';
export default AboutSection;
