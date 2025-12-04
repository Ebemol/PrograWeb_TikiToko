import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap'; 
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Componentes
import Header from "./Componentes/Header";
import LiveChat from "./Componentes/Chat"; 
import GiftListModal from "./Componentes/GiftListModal"; 
import GiftOverlay from "./Componentes/GiftOverlay";     
import useBloqueo from "./hooks/Bloqueo"; 

const WHITE_BORDER = "rgba(255, 255, 255, 0.15)";
const BACKEND_URL = "https://prograweb-tikitoko-backend-lw2q.onrender.com"; 

// Regalos de respaldo
const DEFAULT_GIFTS_FALLBACK = [
  { id: 101, nombre: "Rosa", costo: 10, emoji: "🌹" },
  { id: 102, nombre: "Café", costo: 25, emoji: "☕" },
  { id: 103, nombre: "Gorra", costo: 50, emoji: "🧢" },
  { id: 104, nombre: "TikTok", costo: 100, emoji: "🎵" },
];

interface Gift {
    id: number; 
    nombre: string;
    costo: number;
    emoji: string;
    image?: string | null;
}

interface StreamData {
    id: number; 
    titulo: string;
    clave: string;
    isLive: boolean;
    gifts: Gift[]; 
    streamer: {
        id: number;
        username: string;
        avatar: string | null;
    };
}

const getLocalUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
};

const WatchPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    useBloqueo();

    // Estados UI
    const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoadingStream, setIsLoadingStream] = useState(true);
    
    // Estados Datos
    const [stream, setStream] = useState<StreamData | null>(null); 
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [userCoins, setUserCoins] = useState(0);

    // 1. Cargar Usuario
    useEffect(() => {
        const localUser = getLocalUser();
        if (localUser) {
            setIsAuthorized(true);
            setUserCoins(localUser.coins || 0);
        }
    }, []);

    // 2. Función para cargar datos del Stream (reutilizable)
    const fetchStreamData = async () => {
        if (!id) return;
        try {
            const res = await fetch(`${BACKEND_URL}/stream/key/${id}`);
            
            if (res.ok) {
                const data = await res.json();
                
                // Si no tiene regalos, usar fallback
                if (!data.gifts || data.gifts.length === 0) {
                    data.gifts = DEFAULT_GIFTS_FALLBACK;
                }

                console.log("✅ Stream actualizado:", data);
                setStream(data); 
            } else {
                console.error("Stream no encontrado");
                navigate("/discover");
            }
        } catch (e) {
            console.error("Error de conexión:", e);
        } finally {
            setIsLoadingStream(false);
        }
    };

    // Carga inicial
    useEffect(() => {
        fetchStreamData();
    }, [id, navigate]);

    // 3. ABRIR MODAL (Y REFRESCAR REGALOS)
    const handleOpenGifts = () => {
        if (!isAuthorized) {
            navigate("/"); 
            return;
        }
        // Recargamos para asegurar que tenemos los últimos regalos
        fetchStreamData(); 
        setShowGiftModal(true);
    };

    const handleGiftSent = (newBalance: number) => {
        setUserCoins(newBalance);
        const localUser = getLocalUser();
        if (localUser) {
            localUser.coins = newBalance;
            localStorage.setItem("user", JSON.stringify(localUser));
            window.dispatchEvent(new Event("storage"));
        }
    };

    if (!id) return <div className="bg-black text-white p-5">Error: ID no válido</div>;
    
    if (isLoadingStream) {
        return (
            <div className="bg-black min-vh-100 d-flex justify-content-center align-items-center text-white">
                <div className="spinner-border text-danger me-2" role="status"></div>
                Cargando...
            </div>
        );
    }

    return (
        <div className="bg-black min-vh-100 d-flex flex-column overflow-hidden text-white">
            <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />

            <div className="d-flex flex-grow-1" style={{ height: "calc(100vh - 80px)" }}>
                
                {/* IZQUIERDA: VIDEO */}
                <div className="col-lg-9 mb-4" style={{ height: "100%", padding: "20px", display: "flex", flexDirection: "column" }}>
                    
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <button 
                            className="btn btn-sm btn-outline-secondary text-white border-0 d-flex align-items-center gap-2" 
                            onClick={() => navigate("/discover")} 
                            style={{ background: "#1f1f1f" }}
                        >
                            <i className="bi bi-arrow-left"></i> Volver
                        </button>
                        <div className="badge bg-danger animate-pulse">🔴 EN VIVO</div>
                    </div>

                    <div className="ratio ratio-16x9 shadow-lg position-relative" style={{ borderRadius: "12px", overflow: "hidden", flexGrow: 1, border: `1px solid ${WHITE_BORDER}`, background: "#000" }}>
                        <GiftOverlay />
                        <iframe
                            src={`https://vdo.ninja/?view=${id}&autoplay&clean&controls=0`} 
                            allow="autoplay; fullscreen; picture-in-picture"
                            style={{ width: "100%", height: "100%", border: "none" }}
                            title="Stream Viewer"
                        ></iframe>
                    </div>

                    <div className="mt-3 px-2 d-flex justify-content-between">
                        <p className="text-secondary small m-0 font-monospace">ID: {id}</p>
                        <p className="text-secondary small m-0 fw-bold">Streamer: {stream?.streamer.username || "..."}</p>
                    </div>
                </div>

                {/* DERECHA: CHAT */}
                <div className="col-lg-3" style={{ height: "100%", borderLeft: `1px solid ${WHITE_BORDER}` }}>
                    <div style={{ backgroundColor: "#121212", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                        
                        <div className="d-flex justify-content-between align-items-center" style={{ padding: "15px", borderBottom: `1px solid ${WHITE_BORDER}`, background: "#0b0b0b" }}>
                            <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px", color: "#888" }}>
                                Chat
                            </h6>
                            
                            <Button 
                                variant="danger"
                                size="sm" 
                                onClick={handleOpenGifts} 
                                className="fw-bold d-flex align-items-center gap-2 border-0"
                                style={{ backgroundColor: '#EE1D52', borderRadius: '20px', padding: '5px 15px' }}
                                // Solo bloqueamos si NO hay login
                                disabled={!isAuthorized} 
                            >
                                <i className="bi bi-gift-fill"></i> Regalo
                            </Button>
                        </div>

                        <div style={{ flexGrow: 1, position: "relative" }}>
                            {isAuthorized ? <LiveChat /> : (
                                <div className="d-flex align-items-center justify-content-center h-100 text-secondary flex-column gap-2">
                                    <p className="m-0">Inicia sesión para chatear</p>
                                    <Button onClick={() => navigate("/")} variant="outline-light" size="sm">Login</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            
            {/* MODAL DE REGALOS */}
            <GiftListModal 
                show={showGiftModal} 
                onHide={() => setShowGiftModal(false)} 
                gifts={stream?.gifts || []} 
                streamId={stream?.id || null} 
                userCoins={userCoins} 
                onGiftSent={handleGiftSent} 
            />

            <style>{`
                .animate-pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default WatchPage;