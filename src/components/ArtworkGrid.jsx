import React from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import ArtworkItem from './ArtworkItem';
import { Heart } from 'lucide-react'; // Import ikon Heart

function ArtworkGrid({ artworks, isLoading, error, onArtworkClick, showFavorites }) {
  if (isLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" style={{ color: '#ea580c' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="text-muted mt-2">Loading artworks...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  // Logika baru jika tidak ada artwork
  if (artworks.length === 0) {
    if (showFavorites) {
      // Tampilan jika tab favorit kosong
      return (
        <Container className="my-5 text-center p-5 bg-body-tertiary rounded">
          <Heart size={48} className="text-muted mb-3" />
          <h3 className="text-muted">Your favorites list is empty.</h3>
          <p className="text-muted">Start exploring and add some artworks!</p>
        </Container>
      );
    } else {
      // Tampilan jika pencarian tidak menemukan apa-apa (dan bukan error)
      return (
        <Container className="my-5">
          <Alert variant="info">
            No artworks found. Try a different search term.
          </Alert>
        </Container>
      );
    }
  }

  // Tampilkan grid (logika lama dipertahankan)
  return (
    <Container as="section" className="my-4">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {artworks.map(art => (
          <Col key={art.objectID}>
            {/* ArtworkItem tidak perlu diubah, biarkan apa adanya */}
            <ArtworkItem art={art} onClick={onArtworkClick} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ArtworkGrid;
