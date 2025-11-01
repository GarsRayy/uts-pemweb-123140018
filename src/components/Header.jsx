import React from 'react';
import { Heart, Moon, Sun } from 'lucide-react';

function Header({ favoritesCount, onShowFavorites, showingFavorites, darkMode, onToggleDarkMode }) {
  const hoverBg = 'var(--bs-tertiary-bg)';
  const textColor = 'var(--bs-body-color)';
  const textSecondary = 'var(--bs-text-muted)';
  const borderColor = 'var(--bs-border-color)';

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px', height: '40px', backgroundColor: 'var(--app-accent-color)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <span style={{ fontSize: '0.875rem', color: textSecondary, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Metropolitan Museum
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onToggleDarkMode}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', background: 'transparent', color: textSecondary, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={onShowFavorites}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                borderRadius: '0.5rem', border: showingFavorites ? '1px solid #ef4444' : `1px solid ${borderColor}`,
                backgroundColor: showingFavorites ? '#ef4444' : 'transparent',
                color: showingFavorites ? 'white' : textColor, cursor: 'pointer', transition: '0.2s'
              }}
            >
              <Heart fill={showingFavorites ? 'white' : 'none'} size={18} />
              <span>Favorit ({favoritesCount})</span>
            </button>
          </div>
        </div>

        <h1 style={{ fontSize: '3rem', fontFamily: 'Georgia, serif', color: textColor, fontWeight: 'bold', marginBottom: '0.75rem' }}>
          Koleksi Seni
        </h1>
        <p style={{ color: textSecondary, fontSize: '1.125rem' }}>
          Jelajahi masterpiece dari koleksi Metropolitan Museum of Art
        </p>
      </div>
    </header>
  );
}

export default Header;
