import React, { useState } from 'react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const BACKEND_URL = "https://prograweb-tikitoko-backend-1.onrender.com";
const RED = "#EE1D52";
const WHITE_BORDER = "rgba(255, 255, 255, 0.15)";

// Interfaz que coincide con tu Base de Datos y el resto del front
interface Gift {
  id: number;
  nombre: string;
  costo: number; // En la DB se llama 'costo'
  emoji: string;
  image?: string | null; // <--- IMPORTANTE: Soporte para imagen Base64
}

interface GiftListModalProps {
  show: boolean;
  onHide: () => void;
  gifts: Gift[]; // Recibe la lista cargada desde el Backend
  streamId: number | null;
  userCoins: number;
  onGiftSent: (newBalance: number) => void;
}

const GiftListModal: React.FC<GiftListModalProps> = ({ show, onHide, gifts, streamId, userCoins, onGiftSent }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [message, setMessage] = useState(""); 

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = currentUser ? currentUser.id : null;

  const handleSelectGift = (gift: Gift) => {
      if (userCoins >= gift.costo) {
          setSelectedGift(gift);
          setError(null);
      } else {
          setError(`Te faltan monedas para ${gift.nombre}`);
      }
  };

  const handleSendGift = async () => {
    if (!userId) return setError("Debes iniciar sesión.");
    if (!streamId) return setError("ID de stream no encontrado.");
    if (!selectedGift) return;
    
    setLoading(true);

    try {
      const payload = { 
          userId, 
          giftId: selectedGift.id, 
          streamId,
          message: message.trim()
      };

      const response = await fetch(`${BACKEND_URL}/gift/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Fallo al enviar.");

      // Éxito: Actualizar saldo
      onGiftSent(data.newBalance);
      
      setError(`🎉 ¡${selectedGift.nombre} enviado con éxito!`);
      
      // Limpiar formulario
      setMessage("");
      setSelectedGift(null);
      
      // Cerrar modal automáticamente
      setTimeout(() => {
          setError(null);
          onHide();
      }, 1500);
      
    } catch (err: any) {
      console.error("Fallo envío:", err);
      setError(err.message || "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="bg-transparent border-0">
      <div style={{ 
          backgroundColor: "#121212", 
          color: "white", 
          borderRadius: "16px", 
          border: `1px solid ${WHITE_BORDER}`,
          boxShadow: "0 0 20px rgba(0,0,0,0.8)"
      }}>
          
        {/* CABECERA */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom" style={{ borderColor: WHITE_BORDER }}>
            <div>
                <h5 className="m-0 fw-bold">Enviar Regalo</h5>
                <small className="text-secondary">Saldo: <span className="text-warning fw-bold">{userCoins}</span> 💰</small>
            </div>
            <button onClick={onHide} className="btn btn-link text-secondary p-0" style={{ fontSize: "1.5rem", textDecoration: "none" }}>
                <i className="bi bi-x"></i>
            </button>
        </div>
        
        {/* CUERPO */}
        <div className="p-3">
            {/* Mensajes de Error / Éxito */}
            {error && (
                <Alert 
                    variant={error.startsWith('🎉') ? 'success' : 'danger'} 
                    className="py-2 small fw-bold text-center border-0 mb-3"
                    style={{ borderRadius: "8px", backgroundColor: error.startsWith('🎉') ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)", color: error.startsWith('🎉') ? "#28a745" : "#dc3545" }}
                >
                    {error}
                </Alert>
            )}

            {/* LISTA DE REGALOS (GRID) */}
            <div className="d-flex flex-wrap gap-2 justify-content-center mb-3 custom-scroll" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {gifts.length === 0 ? (
                    <div className="text-center py-4 text-secondary">
                        <i className="bi bi-gift display-4 mb-2 d-block opacity-50"></i>
                        <p className="m-0">No hay regalos disponibles.</p>
                    </div>
                ) : (
                    gifts.map((gift, index) => {
                        const canAfford = userCoins >= gift.costo;
                        const isSelected = selectedGift?.id === gift.id;
                        
                        return (
                            <div 
                                key={index} 
                                onClick={() => canAfford ? handleSelectGift(gift) : null}
                                className={`gift-card d-flex flex-column align-items-center justify-content-center p-2 rounded-3 ${!canAfford ? 'opacity-50' : ''}`}
                                style={{ 
                                    width: "100px", 
                                    height: "110px", 
                                    backgroundColor: isSelected ? "#2a2a2a" : "#1e1e1e", 
                                    cursor: canAfford ? "pointer" : "not-allowed",
                                    border: isSelected ? `2px solid ${RED}` : "1px solid rgba(255,255,255,0.05)",
                                    transition: "all 0.2s",
                                    position: "relative"
                                }}
                            >
                                {/* 🔥🔥🔥 AQUÍ ESTÁ LA CORRECCIÓN CLAVE 🔥🔥🔥 */}
                                {/* Si hay imagen, muestra <img>. Si no, muestra el emoji */}
                                <div style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {gift.image ? (
                                        <img 
                                            src={gift.image} // La cadena Base64
                                            alt={gift.nombre} 
                                            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: "4px" }} 
                                        />
                                    ) : (
                                        <span style={{ fontSize: "2.5rem", lineHeight: "1" }}>{gift.emoji}</span>
                                    )}
                                </div>
                                {/* 🔥🔥🔥 FIN DE LA CORRECCIÓN 🔥🔥🔥 */}

                                <div className="fw-bold small text-white text-truncate w-100 text-center mt-2" style={{ fontSize: "0.8rem" }}>
                                    {gift.nombre}
                                </div>
                                <div className="small text-warning fw-bold bg-dark px-2 rounded-pill mt-1" style={{ fontSize: "0.75rem" }}>
                                    {gift.costo} 💰
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* INPUT DE MENSAJE (Solo visible si se seleccionó un regalo) */}
            {selectedGift && (
                <div className="mt-3 pt-3 border-top" style={{ borderColor: WHITE_BORDER, animation: "fadeIn 0.3s" }}>
                    <Form.Group className="mb-3">
                        <Form.Label className="small text-secondary">Mensaje para el Streamer:</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={2} 
                            placeholder={`Dile algo bonito...`}
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ backgroundColor: "#0b0b0b", border: `1px solid ${WHITE_BORDER}`, color: "white", fontSize: "0.9rem", resize: "none" }}
                        />
                    </Form.Group>
                    
                    <Button 
                        className="w-100 fw-bold py-2" 
                        onClick={handleSendGift} 
                        disabled={loading}
                        style={{ backgroundColor: RED, border: "none", borderRadius: "8px" }}
                    >
                        {loading ? "Enviando..." : `Enviar ${selectedGift.nombre} (${selectedGift.costo} 💰)`}
                    </Button>
                </div>
            )}

        </div>

        {/* FOOTER */}
        {!selectedGift && (
            <div className="p-3 border-top text-center" style={{ borderColor: WHITE_BORDER }}>
                <Button 
                    variant="link" 
                    className="text-decoration-none text-secondary small" 
                    onClick={() => window.open('/shop', '_blank')}
                >
                    <i className="bi bi-plus-circle me-1"></i> Recargar Monedas
                </Button>
            </div>
        )}
      </div>
      
      <style>{`
        .gift-card:hover { transform: translateY(-3px); background-color: #252525 !important; }
        .opacity-50 { opacity: 0.5; }
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Modal>
  );
};

export default GiftListModal;