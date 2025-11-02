import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ArtworkGrid from './components/ArtworkGrid';
import DetailModal from './components/DetailModal';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

// API endpoints
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

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(MET_API_DEPTS_URL);
        const data = await res.json();
        setDepartments(data.departments || []);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    handleSearch('monet', '');
  }, []);

  const handleSearch = async (query, departmentId) => {
    setIsLoading(true);
    setError(null);
    setArtworks([]);
    setShowFavorites(false);

    try {
      const url = departmentId
        ? `${MET_API_SEARCH_URL}?departmentId=${departmentId}&q=${query}&hasImages=true`
        : `${MET_API_SEARCH_URL}?q=${query}&hasImages=true`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.objectIDs && data.objectIDs.length > 0) {
        setArtworkIDs(data.objectIDs);
        setHasMore(data.objectIDs.length > 20);
      } else {
        setError('Tidak ada karya seni ditemukan.');
        setArtworks([]);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error searching artworks:', err);
      setError('Gagal mencari karya seni.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!artworkIDs) return;
    if (artworkIDs.length === 0) {
      setArtworks([]);
      setIsLoading(false);
      return;
    }

    const fetchArtworks = async () => {
      try {
        const idsToLoad = artworkIDs.slice(0, 20);
        const promises = idsToLoad.map(id =>
          fetch(`${MET_API_OBJECT_URL}/${id}`).then(res => res.ok ? res.json() : null)
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

  const loadMore = async () => {
    if (!artworkIDs || artworks.length >= artworkIDs.length) return;
    setIsLoadingMore(true);
    try {
      const nextIds = artworkIDs.slice(artworks.length, artworks.length + 20);
      const promises = nextIds.map(id =>
        fetch(`${MET_API_OBJECT_URL}/${id}`).then(res => res.ok ? res.json() : null)
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
          hasMore={hasMore}
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
