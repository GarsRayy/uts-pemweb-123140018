import React from 'react';
import { Heart, Moon, Sun } from 'lucide-react';

// Header Component (dari snippet baru)
// Komponen ini menggunakan inline style, jadi kita perlu pass warna
function Header({ favoritesCount, onShowFavorites, showingFavorites, darkMode, onToggleDarkMode, borderColor, textColor, textSecondary, hoverBg }) {
  return (
    <header style={{ borderBottom: `1px solid ${borderColor}`, backgroundColor: darkMode ? '#000' : '#fff' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#ea580c',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* SVG Logo (dari snippet baru) */}
              <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Metropolitan Museum
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                color: textSecondary
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Favorites Button */}
            <button
              onClick={onShowFavorites}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: showingFavorites ? '1px solid #ef4444' : `1px solid ${borderColor}`,
                backgroundColor: showingFavorites ? '#ef4444' : 'transparent',
                color: showingFavorites ? 'white' : textColor,
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
            >
              <Heart fill={showingFavorites ? 'white' : 'none'} size={18} />
              <span>Favorit ({favoritesCount})</span>
            </button>
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: '3rem', fontFamily: 'Georgia, serif', fontWeight: 'bold', color: textColor, marginBottom: '0.75rem' }}>
            Koleksi Seni
          </h1>
          <p style={{ color: textSecondary, fontSize: '1.125rem' }}>
            Jelajahi masterpiece dari koleksi Metropolitan Museum of Art
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
