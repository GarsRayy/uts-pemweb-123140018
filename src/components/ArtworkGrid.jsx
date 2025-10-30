import React from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import ArtworkItem from './ArtworkItem';

function ArtworkGrid({ artworks, isLoading, error, onArtworkClick }) {
  if (isLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading artworks...</p>
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
    return (
      <Container className="my-5">
        <Alert variant="info">
          No artworks found. Try a different search term.
        </Alert>
      </Container>
    );
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
    </Container>
  );
}

export default ArtworkGrid;