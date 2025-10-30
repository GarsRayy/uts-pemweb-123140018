import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ArtworkGrid from './components/ArtworkGrid';
import './App.css';

function App() {
  const [artworkIDs, setArtworkIDs] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const MET_API_SEARCH_URL = "https://collectionapi.metmuseum.org/public/collection/v1/search";
  const MET_API_OBJECT_URL = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

  useEffect(() => {
    const fetchInitialSearch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${MET_API_SEARCH_URL}?q=monet`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data pencarian');
        }
        const data = await response.json();
        
        if (data.total === 0 || !data.objectIDs) {
          setArtworkIDs([]); 
        } else {
          setArtworkIDs(data.objectIDs); 
        }
      } catch (err) {
        setError(err.message);
        setIsLoading(false); 
      }
    };

    fetchInitialSearch();
  }, []); 

  useEffect(() => {
    const fetchArtworkDetails = async () => {
      if (!artworkIDs) return; 
      if (artworkIDs.length === 0) {
        setArtworks([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true); 
      setError(null);

      try {
        const firstTwentyIDs = artworkIDs.slice(0, 20);
        
        const artworkPromises = firstTwentyIDs.map(async (id) => {
          const objResponse = await fetch(`${MET_API_OBJECT_URL}/${id}`);
          if (!objResponse.ok) {
            console.warn(`Gagal mengambil detail objek ${id}`);
            return null; 
          }
          return objResponse.json();
        });

        const detailedArtworks = await Promise.all(artworkPromises);
        
        const validArtworks = detailedArtworks.filter(art => art && art.primaryImageSmall);
        
        setArtworks(validArtworks);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchArtworkDetails();
  }, [artworkIDs]); 

  return (
    <div className="App">
      <Header />
      <main>
        <SearchForm />
        <ArtworkGrid 
          artworks={artworks}
          isLoading={isLoading}
          error={error} 
        />
      </main>
    </div>
  );
}

export default App;