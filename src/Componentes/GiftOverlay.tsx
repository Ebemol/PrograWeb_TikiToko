import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";

// Conexión al socket
const socket = io("http://localhost:5002");

interface GiftEvent {
    id: number; 
    senderName: string;
    avatar?: string;
    message?: string;
    giftName: string;      
    giftEmoji: string;     
    giftImage?: string | null; 
}

const GiftOverlay: React.FC = () => {
    const [queue, setQueue] = useState<GiftEvent[]>([]);
    const [currentGift, setCurrentGift] = useState<GiftEvent | null>(null);

    useEffect(() => {
        const handleNewGift = (data: any) => {
            setQueue(prev => [...prev, { ...data, id: Date.now() + Math.random() }]);
        };
        socket.on("new_gift_event", handleNewGift);
        return () => { socket.off("new_gift_event", handleNewGift); };
    }, []);

    useEffect(() => {
        if (!currentGift && queue.length > 0) {
            const nextGift = queue[0];
            setCurrentGift(nextGift);
            setQueue(prev => prev.slice(1));
            setTimeout(() => { setCurrentGift(null); }, 5000);
        }
    }, [queue, currentGift]);

    if (!currentGift) return null;

    return (
        <div style={{
            position: "absolute",
            top: "40%", // Bajamos un poco el centro para que quepa bien
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            pointerEvents: "none", 
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div className="gift-animation-wrapper">
                
                {/* 1. EL REGALO GIGANTE (AHORA ARRIBA) */}
                <div className="gift-icon-bounce">
                    {currentGift.giftImage ? (
                        <img 
                            src={currentGift.giftImage} 
                            alt={currentGift.giftName}
                            className="gift-image-styled"
                        />
                    ) : (
                        <span className="gift-emoji-styled">
                            {currentGift.giftEmoji}
                        </span>
                    )}
                </div>

                {/* 2. TARJETA DEL DONADOR (AHORA ABAJO) */}
                <div className="gift-card-content shadow-lg">
                    <div className="avatar-container">
                        <img 
                            src={currentGift.avatar || "https://i.pravatar.cc/150"} 
                            alt="avatar" 
                            className="user-avatar"
                        />
                    </div>
                    
                    <div className="text-content">
                        <div className="user-name text-truncate">{currentGift.senderName}</div>
                        <div className="gift-action">
                            envió <span className="gift-name">{currentGift.giftName}</span>
                        </div>
                        
                        {currentGift.message && (
                            <div className="user-message text-truncate">
                                "{currentGift.message}"
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <style>{`
                .gift-animation-wrapper {
                    display: flex;
                    flex-direction: column; /* Elementos uno encima del otro */
                    align-items: center;
                    animation: slideUpFade 0.5s ease-out, fadeOut 0.5s 4.5s forwards;
                }

                /* El Regalo */
                .gift-icon-bounce {
                    margin-bottom: 10px; /* Separación entre regalo y tarjeta */
                    z-index: 10;
                    animation: popBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both; 
                }

                .gift-image-styled {
                    width: 100px; height: 100px; /* Tamaño controlado */
                    object-fit: contain;
                    filter: drop-shadow(0 5px 15px rgba(0,0,0,0.6));
                }
                .gift-emoji-styled {
                    font-size: 4rem;
                    filter: drop-shadow(0 5px 15px rgba(0,0,0,0.6));
                }

                /* La Tarjeta */
                .gift-card-content {
                    display: flex;
                    align-items: center;
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 50px;
                    padding: 6px 20px 6px 6px;
                    border: 2px solid #EE1D52; 
                    min-width: 220px;
                    max-width: 350px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                }

                .user-avatar {
                    width: 50px; height: 50px;
                    border-radius: 50%; border: 2px solid #fff;
                    object-fit: cover;
                }

                .text-content { margin-left: 12px; color: white; line-height: 1.2; text-align: left; }
                .user-name { font-weight: 800; font-size: 1rem; color: #fff; }
                .gift-action { font-size: 0.85rem; color: #ddd; }
                .gift-name { color: #EE1D52; font-weight: 800; text-transform: uppercase; }
                .user-message { 
                    font-size: 0.8rem; 
                    font-style: italic; 
                    color: #bbb; 
                    margin-top: 4px; 
                    max-width: 180px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* Animaciones */
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(50px) scale(0.8); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes fadeOut { to { opacity: 0; transform: translateY(-40px); } }
                @keyframes popBounce {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default GiftOverlay;