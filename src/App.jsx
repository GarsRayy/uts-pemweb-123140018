import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ArtworkGrid from './components/ArtworkGrid';
import DetailModal from './components/DetailModal';
import AboutSection from './components/AboutSection';
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
  const [error, setError] = useState(null);
  const [selectedArt, setSelectedArt] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [favorites, setFavorites] = useLocalStorage('museumFavorites', []);
  const [showFavorites, setShowFavorites] = useState(false);

  // Light mode default
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme to bootstrap
  useEffect(() => {
    document.documentElement.dataset.bsTheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  // Fetch departments
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

  // Default search: "monet"
  useEffect(() => {
    setIsLoading(true);
    handleSearch("monet", "");
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
      if (!res.ok) throw new Error('Gagal mengambil data pencarian');
      const data = await res.json();

      if (data.objectIDs && data.objectIDs.length > 0) {
        setArtworkIDs(data.objectIDs.slice(0, 20));
      } else {
        setError('Tidak ada karya seni ditemukan. Coba kata kunci lain.');
        setIsLoading(false);
        setArtworkIDs([]);
      }
    } catch (err) {
      setError(err.message || 'Gagal mencari karya seni. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  // Fetch details for artworks
  useEffect(() => {
    if (!artworkIDs) return;
    if (artworkIDs.length === 0) {
      setArtworks([]);
      setIsLoading(false);
      return;
    }

    const fetchArtworkDetails = async () => {
      try {
        const promises = artworkIDs.map(id =>
          fetch(`${MET_API_OBJECT_URL}/${id}`)
            .then(res => res.ok ? res.json() : null)
            .catch(() => null)
        );
        const results = await Promise.all(promises);
        const validArtworks = results.filter(art => art && art.primaryImageSmall);
        setArtworks(validArtworks);
      } catch (err) {
        setError(`Gagal memuat detail karya seni: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtworkDetails();
  }, [artworkIDs]);

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
        />
      </main>

      <DetailModal
        art={selectedArt}
        show={selectedArt !== null}
        onHide={() => setSelectedArt(null)}
        onAddFavorite={addFavorite}
        onRemoveFavorite={removeFavorite}
        isFavorite={selectedArt ? isFavorite(selectedArt.objectID) : false}
      />
    </div>
  );
}

export default App;
