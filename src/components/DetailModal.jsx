import React from 'react';
import { Modal, Button, Image, Table, Badge } from 'react-bootstrap';
import { Heart } from 'lucide-react'; // Import ikon Heart

// Modifikasi props untuk menerima logika favorit baru
function DetailModal({ art, show, onHide, onAddFavorite, onRemoveFavorite, isFavorite }) {
  if (!art) return null;

  // Tidak perlu `isFavorited` state di sini, `isFavorite` adalah boolean dari prop
  
  return (
    // Modal ini akan otomatis ganti tema (dark/light)
    // berkat `data-bs-theme` di <html>
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
        {/* --- LOGIKA TOMBOL FAVORIT BARU --- */}
        {isFavorite ? (
          <Button 
            variant="outline-danger" 
            onClick={() => onRemoveFavorite(art.objectID)}
            className="d-flex align-items-center gap-2"
          >
            <Heart fill="currentColor" size={18} />
            Remove from Favorites
          </Button>
        ) : (
          <Button 
            variant="danger" 
            onClick={() => onAddFavorite(art)}
            className="d-flex align-items-center gap-2"
            style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
          >
            <Heart size={18} />
            Add to Favorites
          </Button>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DetailModal;
