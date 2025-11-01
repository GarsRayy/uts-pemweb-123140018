import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ArtworkGrid from './components/ArtworkGrid';
import DetailModal from './components/DetailModal';
import AboutSection from './components/AboutSection';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

function App() {
  // State dari proyek asli
  const [artworkIDs, setArtworkIDs] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArt, setSelectedArt] = useState(null);
  const [departments, setDepartments] = useState([]);

  // State baru dari snippet (UI cakep)
  // Menyimpan objek artwork lengkap, bukan hanya ID
  const [favorites, setFavorites] = useLocalStorage('museumFavorites', []);
  const [showFavorites, setShowFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showAbout, setShowAbout] = useState(true); // Tampilkan "About" saat pertama kali load

  // URL API
  const MET_API_SEARCH_URL = "https://collectionapi.metmuseum.org/public/collection/v1/search";
  const MET_API_OBJECT_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";
  const MET_API_DEPTS_URL = "https://collectionapi.metmuseum.org/public/collection/v1/departments";

  // --- LOGIKA BARU UNTUK DARK MODE ---
  // Ini akan menerapkan 'data-bs-theme' ke tag <html>
  // sehingga react-bootstrap otomatis berganti tema
  useEffect(() => {
    document.documentElement.dataset.bsTheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  // --- LOGIKA FETCH BARU (Digabung dari kedua versi) ---

  // 1. Fetch departments saat aplikasi load
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

  // 2. Handle Search (dari snippet baru, lebih efisien)
  const handleSearch = async (query, departmentId) => {
    setIsLoading(true);
    setError(null);
    setArtworks([]);
    setShowFavorites(false); // Matikan mode favorit saat mencari
    setShowAbout(false);     // Sembunyikan "About" saat mencari

    try {
      const url = departmentId
        ? `${MET_API_SEARCH_URL}?departmentId=${departmentId}&q=${query}&hasImages=true`
        : `${MET_API_SEARCH_URL}?q=${query}&hasImages=true`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal mengambil data pencarian');
      const data = await res.json();

      if (data.objectIDs && data.objectIDs.length > 0) {
        // Ambil 20 ID pertama
        setArtworkIDs(data.objectIDs.slice(0, 20));
      } else {
        setError('Tidak ada karya seni ditemukan. Coba kata kunci lain.');
        setIsLoading(false);
        setArtworkIDs([]); // Set ke array kosong
      }
    } catch (err) {
      setError(err.message || 'Gagal mencari karya seni. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  // 3. Fetch detail artwork berdasarkan objectIDs
  // (Ini dieksekusi setelah state artworkIDs berubah)
  useEffect(() => {
    if (!artworkIDs) return; // Jangan lakukan apa-apa jika masih null
    if (artworkIDs.length === 0) {
      // Jika search tidak menghasilkan apa-apa
      setArtworks([]);
      setIsLoading(false);
      return;
    }

    const fetchArtworkDetails = async () => {
      try {
        const promises = artworkIDs.map(id =>
          fetch(`${MET_API_OBJECT_URL}/${id}`)
            .then(res => {
              if (res.ok) return res.json();
              return null; // Kembalikan null jika ada error
            })
            .catch(() => null) // Kembalikan null jika fetch gagal
        );

        const results = await Promise.all(promises);
        // Filter artwork yang valid (ada data & punya gambar)
        const validArtworks = results.filter(art => art && art.primaryImageSmall);
        setArtworks(validArtworks);
      } catch (err) {
        console.error('Error fetching artwork details:', err);
        setError('Gagal memuat detail karya seni.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworkDetails();
  }, [artworkIDs]);

  // --- LOGIKA FAVORIT BARU (dari snippet) ---
  // Menyimpan seluruh objek, bukan hanya ID
  const addFavorite = (artwork) => {
    if (!favorites.find(fav => fav.objectID === artwork.objectID)) {
      setFavorites([...favorites, artwork]);
    }
  };

  const removeFavorite = (objectID) => {
    setFavorites(favorites.filter(fav => fav.objectID !== objectID));
  };

  const isFavorite = (objectID) => {
    return favorites.some(fav => fav.objectID === objectID);
  };

  // --- Handler untuk Modal ---
  const handleArtworkClick = (art) => {
    setSelectedArt(art);
  };

  const handleCloseModal = () => {
    setSelectedArt(null);
  };

  // --- Variabel warna untuk komponen Non-Bootstrap (inline style) ---
    const textColor = darkMode ? '#ffffff' : '#111827';
    const textSecondary = darkMode ? '#9ca3af' : '#6b7280';
    const borderColor = darkMode ? '#1f2937' : '#e5e7eb';
    const hoverBg = darkMode ? '#1f2937' : '#f3f4f6';


  return (
    // Kita tidak perlu set `backgroundColor` di div ini
    // karena `data-bs-theme` di <html> akan mengaturnya
    <div className="App">
      <Header
        favoritesCount={favorites.length}
        onShowFavorites={() => {
          setShowFavorites(!showFavorites);
          setShowAbout(false); // Sembunyikan about saat lihat favorit
        }}
        showingFavorites={showFavorites}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        borderColor={borderColor}
        textColor={textColor}
        textSecondary={textSecondary}
        hoverBg={hoverBg}
      />

      <main>
        {/* Tampilkan "About" secara kondisional */}
        {showAbout && (
          <AboutSection
            darkMode={darkMode}
            textColor={textColor}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        )}

        {/* SearchForm (Komponen Bootstrap) */}
        {/* Tidak perlu prop darkMode, akan di-handle `data-bs-theme` */}
        <SearchForm
          departments={departments}
          onSearch={handleSearch}
          initialQuery="monet"
          isLoading={departments.length === 0}
        />

        {/* ArtworkGrid (Komponen Bootstrap) */}
        {/* Tidak perlu prop darkMode */}
        <ArtworkGrid
          artworks={showFavorites ? favorites : artworks}
          isLoading={isLoading}
          error={error}
          onArtworkClick={handleArtworkClick}
          showFavorites={showFavorites}
        />
      </main>

      {/* DetailModal (Komponen Bootstrap) */}
      {/* Tidak perlu prop darkMode */}
      <DetailModal
        art={selectedArt}
        show={selectedArt !== null}
        onHide={handleCloseModal}
        // Kirim prop baru untuk logika favorit
        onAddFavorite={addFavorite}
        onRemoveFavorite={removeFavorite}
        isFavorite={selectedArt ? isFavorite(selectedArt.objectID) : false}
      />
    </div>
  );
}

export default App;
