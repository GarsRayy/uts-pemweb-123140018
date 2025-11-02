import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import SearchForm from './components/SearchForm/SearchForm';
import ArtworkGrid from './components/ArtworkGrid/ArtworkGrid';
import DetailModal from './components/DetailModal/DetailModal';
import AboutSection from './components/AboutSection/AboutSection';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

// API endpoints (Kembalikan ke URL asli)
const MET_API_SEARCH_URL = "https://collectionapi.metmuseum.org/public/collection/v1/search";
const MET_API_OBJECT_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";
const MET_API_DEPTS_URL = "https://collectionapi.metmuseum.org/public/collection/v1/departments";

function App() {
  const [artworkIDs, setArtworkIDs] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArt, setSelectedArt] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [favorites, setFavorites] = useLocalStorage('museumFavorites', []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.bsTheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  // Efek untuk fetch departemen
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // --- FIX 1 DARI 4: Tambahkan referrerPolicy ---
        const res = await fetch(MET_API_DEPTS_URL, { referrerPolicy: 'no-referrer' });
        const data = await res.json();
        setDepartments(data.departments || []);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  // Efek untuk fetch pencarian awal
  useEffect(() => {
    setIsLoading(true);
    handleSearch('monet', '');
  }, []);

  // Fungsi pencarian
  const handleSearch = async (query, departmentId) => {
    setIsLoading(true);
    setError(null);
    setArtworks([]);
    setShowFavorites(false);

    try {
      const url = departmentId
        ? `${MET_API_SEARCH_URL}?departmentId=${departmentId}&q=${query}&hasImages=true`
        : `${MET_API_SEARCH_URL}?q=${query}&hasImages=true`;

      // --- FIX 2 DARI 4: Tambahkan referrerPolicy ---
      const res = await fetch(url, { referrerPolicy: 'no-referrer' });
      const data = await res.json();

      if (data.objectIDs && data.objectIDs.length > 0) {
        setArtworkIDs(data.objectIDs);
        setHasMore(data.objectIDs.length > 20);
      } else {
        setError('Tidak ada karya seni ditemukan.');
        setArtworkIDs(null);
        setArtworks([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error searching artworks:', err);
      setError('Gagal mencari karya seni.');
      setIsLoading(false);
      setArtworkIDs(null);
    }
  };

  // Efek untuk fetch detail artworks
  useEffect(() => {
    if (!artworkIDs) {
      setIsLoading(false);
      return;
    }

    const fetchArtworks = async () => {
      try {
        const idsToLoad = artworkIDs.slice(0, 20);
        const promises = idsToLoad.map(id =>
          // --- FIX 3 DARI 4: Tambahkan referrerPolicy ---
          fetch(`${MET_API_OBJECT_URL}/${id}`, { referrerPolicy: 'no-referrer' })
            .then(res => res.ok ? res.json() : null)
        );
        const results = await Promise.all(promises);
        const valid = results.filter(a => a && a.primaryImageSmall);
        setArtworks(valid);
      } catch {
        setError('Gagal memuat karya seni.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, [artworkIDs]);

  // Fungsi Load More
  const loadMore = async () => {
    if (!artworkIDs || artworks.length >= artworkIDs.length) return;
    setIsLoadingMore(true);
    try {
      const nextIds = artworkIDs.slice(artworks.length, artworks.length + 20);
      
      const promises = nextIds.map(id =>
        // --- FIX 4 DARI 4: Tambahkan referrerPolicy ---
        fetch(`${MET_API_OBJECT_URL}/${id}`, { referrerPolicy: 'no-referrer' })
          .then(res => res.ok ? res.json() : null)
      );
      const results = await Promise.all(promises);
      const valid = results.filter(a => a && a.primaryImageSmall);
      
      setArtworks([...artworks, ...valid]);
      setHasMore(artworks.length + valid.length < artworkIDs.length);
    } catch {
      setError('Gagal memuat lebih banyak karya.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Fungsi-fungsi favorit
  const addFavorite = (artwork) => {
    if (!favorites.find(fav => fav.objectID === artwork.objectID)) {
      setFavorites([...favorites, artwork]);
    }
  };

  const removeFavorite = (objectID) => {
    setFavorites(favorites.filter(fav => fav.objectID !== objectID));
  };

  const isFavorite = (objectID) => favorites.some(fav => fav.objectID === objectID);

  return (
    <div className="App">
      <Header
        favoritesCount={favorites.length}
        onShowFavorites={() => setShowFavorites(!showFavorites)}
        showingFavorites={showFavorites}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      <main>
        <AboutSection />
        <SearchForm
          departments={departments}
          onSearch={handleSearch}
          initialQuery="monet"
          isLoading={departments.length === 0}
        />
        <ArtworkGrid
          artworks={showFavorites ? favorites : artworks}
          isLoading={isLoading}
          error={error}
          onArtworkClick={setSelectedArt}
          showFavorites={showFavorites}
          onLoadMore={loadMore}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore && !showFavorites}
        />
      </main>

      <DetailModal
        art={selectedArt}
        show={!!selectedArt}
        onHide={() => setSelectedArt(null)}
        onAddFavorite={addFavorite}
        onRemoveFavorite={removeFavorite}
        isFavorite={selectedArt ? isFavorite(selectedArt.objectID) : false}
      />

      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;

