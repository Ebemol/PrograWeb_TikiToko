import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

// Define la interfaz para los objetos de regalo que vienen del backend
interface Gift {
  nombre: string;
  costo: number;
  emoji: string;
}

interface GiftListModalProps {
  show: boolean;
  onHide: () => void;
  gifts: Gift[];
}

/**
 * Modal para mostrar la lista de regalos disponibles en el stream.
 */
const GiftListModal: React.FC<GiftListModalProps> = ({ show, onHide, gifts }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-white border-0">
        <Modal.Title>🎁 Lista de Regalos</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark text-white">
        {gifts.length === 0 ? (
          <p className="text-center text-secondary">
            Este streamer aún no ha configurado regalos.
          </p>
        ) : (
          <ListGroup variant="flush">
            {gifts.map((gift, index) => (
              <ListGroup.Item 
                key={index} 
                className="d-flex justify-content-between align-items-center bg-dark text-white border-secondary"
                style={{ borderBottom: index < gifts.length - 1 ? '1px solid #333' : 'none' }}
              >
                <div>
                  <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>{gift.emoji}</span>
                  <span className="fw-bold">{gift.nombre}</span>
                </div>
                <div className="text-info">
                  <i className="bi bi-coin me-1"></i> 
                  {gift.costo}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      
      <Modal.Footer className="bg-dark border-0">
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GiftListModal;