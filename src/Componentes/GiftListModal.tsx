import React from 'react';
import { Modal, Button, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = "http://localhost:5002"; // <-- Asegúrate de que esta URL sea correcta

interface Gift {
  id: number; // Necesitas el ID del regalo para la API
  nombre: string;
  costo: number;
  emoji: string;
}

interface GiftListModalProps {
  show: boolean;
  onHide: () => void;
  gifts: Gift[];
  streamId: number | null; // Necesitas el ID del stream
  userCoins: number; // Monedas del usuario actual
  onGiftSent: (newBalance: number) => void; // Callback para actualizar las monedas
}

/**
 * Modal para mostrar la lista de regalos disponibles en el stream y permitir la compra.
 */
const GiftListModal: React.FC<GiftListModalProps> = ({ show, onHide, gifts, streamId, userCoins, onGiftSent }) => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Obtener el ID del usuario logueado
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = currentUser ? currentUser.id : null;

  // Manejar el envío del regalo
  const handleSendGift = async (gift: Gift) => {
    if (!userId) {
      setError("Debes iniciar sesión para enviar regalos.");
      return;
    }
    if (!streamId) {
        setError("Error: ID de stream no encontrado.");
        return;
    }

    // Verificar monedas en el frontend antes de enviar
    if (userCoins < gift.costo) {
      setError(`Monedas insuficientes para ${gift.nombre}. Necesitas ${gift.costo} monedas.`);
      return;
    }
    
    // Si todo está bien, limpiar errores y comenzar la petición
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/gift/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          giftId: gift.id,
          streamId: streamId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores como "Monedas insuficientes" o "Regalo no encontrado"
        throw new Error(data.error || "Fallo al enviar el regalo.");
      }

      // Éxito:
      onGiftSent(data.newBalance); // Actualiza las monedas en WatchPage
      setError(`🎉 Has enviado ${gift.emoji} ${gift.nombre} por ${gift.costo} monedas!`);
      // No ocultar el modal automáticamente para que el usuario vea el mensaje de éxito
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error de conexión al enviar el regalo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-white border-0">
        <Modal.Title>🎁 Lista de Regalos (Tu saldo: {userCoins})</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="bg-dark text-white">
        {error && <Alert variant={error.startsWith('🎉') ? 'success' : 'danger'}>{error}</Alert>}

        {gifts.length === 0 ? (
          <p className="text-center text-secondary">
            Este streamer aún no ha configurado regalos.
          </p>
        ) : (
          <ListGroup variant="flush">
            {gifts.map((gift, index) => (
              <ListGroup.Item 
                key={index} 
                className={`d-flex justify-content-between align-items-center bg-dark text-white ${userCoins >= gift.costo ? 'list-group-item-action' : 'text-secondary'}`}
                style={{ cursor: userCoins >= gift.costo ? 'pointer' : 'not-allowed', opacity: userCoins >= gift.costo ? 1 : 0.6 }}
                onClick={() => userCoins >= gift.costo && !loading ? handleSendGift(gift) : null}
                disabled={userCoins < gift.costo || loading}
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
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GiftListModal;