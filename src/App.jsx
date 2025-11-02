import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ArtworkGrid from './components/ArtworkGrid';
import DetailModal from './components/DetailModal';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

// API endpoints
const MET_API_SEARCH_URL = "https://collectionapi.metmuseum.org/public/collection/v1/search";
const MET_API_OBJECT_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";
const MET_API_DEPTS_URL = "https://collectionapi.metmuseum.org/public/collection/v1/departments";
const PAGE_SIZE = 20; // Jumlah item per halaman

function App() {
  const [allObjectIDs, setAllObjectIDs] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [selectedArt, setSelectedArt] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [favorites, setFavorites] = useLocalStorage('museumFavorites', []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.bsTheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  useEffect(() => {
    fetchDepartments();
    handleSearch("monet", "");
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch(MET_API_DEPTS_URL);
      const data = await res.json();
      setDepartments(data.departments || []);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchArtworkDetails = async (ids) => {
    try {
      const promises = ids.map(id =>
        fetch(`${MET_API_OBJECT_URL}/${id}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      );
      const results = await Promise.all(promises);
      return results.filter(art => art && art.primaryImageSmall);
    } catch (err) {
      setError(`Gagal memuat detail karya seni: ${err.message}`);
      return [];
    }
  };

  const handleSearch = async (query, departmentId) => {
    setIsLoading(true);
    setError(null);
    setArtworks([]);
    setCurrentPage(1);
    setShowFavorites(false);

    try {
      const url = departmentId
        ? `${MET_API_SEARCH_URL}?departmentId=${departmentId}&q=${query}&hasImages=true`
        : `${MET_API_SEARCH_URL}?q=${query}&hasImages=true`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal mengambil data pencarian');
      const data = await res.json();

      if (data.objectIDs && data.objectIDs.length > 0) {
        setAllObjectIDs(data.objectIDs);
        const firstPageIDs = data.objectIDs.slice(0, PAGE_SIZE);
        const firstPageArtworks = await fetchArtworkDetails(firstPageIDs);
        setArtworks(firstPageArtworks);
      } else {
        setError('Tidak ada karya seni ditemukan. Coba kata kunci lain.');
        setAllObjectIDs([]);
      }
    } catch (err) {
      setError(err.message || 'Gagal mencari karya seni. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = nextPage * PAGE_SIZE;
    const newIDs = allObjectIDs.slice(startIndex, endIndex);

    if (newIDs.length > 0) {
      const newArtworks = await fetchArtworkDetails(newIDs);
      setArtworks(prev => [...prev, ...newArtworks]);
      setCurrentPage(nextPage);
    }

    setIsLoadingMore(false);
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
  const hasMore = artworks.length < allObjectIDs.length;

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
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore && !showFavorites}
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

      <Footer />
    </div>
  );
}

export default App;
