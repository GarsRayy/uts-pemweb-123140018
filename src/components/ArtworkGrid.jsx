import React from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import ArtworkItem from './ArtworkItem';
import { Heart, Loader2 } from 'lucide-react'; // Import Loader2 untuk tombol

// Terima prop baru
function ArtworkGrid({ artworks, isLoading, error, onArtworkClick, showFavorites, onLoadMore, isLoadingMore, hasMore }) {
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

  if (artworks.length === 0) {
    if (showFavorites) {
      return (
        <Container className="my-5 text-center p-5 bg-body-tertiary rounded">
          <Heart size={48} className="text-muted mb-3" />
          <h3 className="text-muted">Your favorites list is empty.</h3>
          <p className="text-muted">Start exploring and add some artworks!</p>
        </Container>
      );
    } else {
      return (
        <Container className="my-5">
          <Alert variant="info">
            No artworks found. Try a different search term.
          </Alert>
        </Container>
      );
    }
  }

  return (
    <Container as="section" className="my-4">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {artworks.map(art => (
          <Col key={art.objectID}>
            <ArtworkItem art={art} onClick={onArtworkClick} />
          </Col>
        ))}
      </Row>

      {/* --- TOMBOL LOAD MORE BARU --- */}
      {hasMore && (
        <div className="text-center mt-5">
          <Button
            variant="outline-secondary"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="load-more-btn"
          >
            {isLoadingMore ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span className="ms-2">Loading...</span>
              </>
            ) : (
              "Load More Artworks"
            )}
          </Button>
        </div>
      )}
    </Container>
  );
}

export default ArtworkGrid;