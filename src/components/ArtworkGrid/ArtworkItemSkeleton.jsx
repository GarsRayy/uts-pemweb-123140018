import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';

function ArtworkItemSkeleton() {
  return (
    <Card className="h-100 shadow-sm">
      <div className="card-img-top" style={{ height: '250px' }}>
        <Placeholder animation="glow" as="div" style={{ height: '100%', width: '100%' }}>
          <Placeholder xs={12} style={{ height: '100%' }} />
        </Placeholder>
      </div>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
      </Card.Body>
    </Card>
  );
}

export default ArtworkItemSkeleton;
