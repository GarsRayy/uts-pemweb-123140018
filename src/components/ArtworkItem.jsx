import React from 'react';
import { Card } from 'react-bootstrap';

function ArtworkItem({ art }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={art.primaryImageSmall} 
        alt={art.title} 
        style={{ height: '250px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title 
          className="text-truncate"
          style={{ maxHeight: '48px', overflow: 'hidden' }}
          title={art.title}
        >
          {art.title}
        </Card.Title>
        <Card.Text className="text-muted">
          {art.artistDisplayName || 'Unknown Artist'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ArtworkItem;