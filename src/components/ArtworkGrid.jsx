import React from 'react';
import { Container, Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import ArtworkItem from './ArtworkItem';
import ArtworkItemSkeleton from './ArtworkItemSkeleton';
import { Heart } from 'lucide-react';

function ArtworkGrid({
  artworks,
  isLoading,
  error,
  onArtworkClick,
  showFavorites,
  onLoadMore,
  isLoadingMore,
  hasMore
}) {
  // --- Loading state pakai skeleton ---
  if (isLoading) {
    return (
      <Container as="section" className="my-4">
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {[...Array(8)].map((_, index) => (
            <Col key={`skeleton-${index}`}>
              <ArtworkItemSkeleton />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <Container as="section" className="my-4">
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  // --- Empty state ---
  if (artworks.length === 0) {
    return (
      <Container as="section" className="my-4 text-center">
        <div className="p-5">
          <Heart size={48} className="mb-3 text-muted" />
          <h5 className="text-muted">
            {showFavorites ? 'Belum ada karya favorit disimpan.' : 'Tidak ada karya ditemukan.'}
          </h5>
        </div>
      </Container>
    );
  }

  // --- Normal render ---
  return (
    <Container as="section" className="my-4">
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {artworks.map((art) => {
          // Pastikan key unik meskipun objectID duplikat
          const safeKey = art.objectID ? `art-${art.objectID}-${Math.random()}` : `unknown-${Math.random()}`;

          return (
            <Col key={safeKey}>
              <ArtworkItem art={art} onClick={onArtworkClick} />
            </Col>
          );
        })}
      </Row>

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
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Loading...</span>
              </>
            ) : (
              'Load More Artworks'
            )}
          </Button>
        </div>
      )}
    </Container>
  );
}

export default ArtworkGrid;
