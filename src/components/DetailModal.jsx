import React from 'react';
import { Modal, Button, Image, Table, Badge } from 'react-bootstrap';

function DetailModal({ art, show, onHide }) {
  if (!art) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{art.title || 'Artwork Detail'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image src={art.primaryImage} alt={art.title} fluid rounded className="mb-3" />
        
        <Table striped bordered hover responsive>
          <tbody>
            <tr>
              <td><strong>Artist</strong></td>
              <td>{art.artistDisplayName || 'Unknown'}</td>
            </tr>
            <tr>
              <td><strong>Date</strong></td>
              <td>{art.objectDate || 'Unknown'}</td>
            </tr>
            <tr>
              <td><strong>Medium</strong></td>
              <td>{art.medium || 'Unknown'}</td>
            </tr>
            <tr>
              <td><strong>Culture</strong></td>
              <td>{art.culture || 'Unknown'}</td>
            </tr>
            <tr>
              <td><strong>Department</strong></td>
              <td>{art.department || 'Unknown'}</td>
            </tr>
            <tr>
              <td><strong>Public Domain</strong></td>
              <td>
                {art.isPublicDomain ? 
                  <Badge bg="success">Yes</Badge> : 
                  <Badge bg="warning">No</Badge>
                }
              </td>
            </tr>
          </tbody>
        </Table>

        {art.objectURL && (
          <Button variant="link" href={art.objectURL} target="_blank" rel="noopener noreferrer">
            View on Met Museum Website
          </Button>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DetailModal;