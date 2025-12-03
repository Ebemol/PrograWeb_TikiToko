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
import useBloqueo from "./hooks/Bloqueo"; // Ajusta la ruta si es necesario

const WHITE_BORDER = "rgba(255, 255, 255, 0.15)";
const BACKEND_URL = "http://localhost:5002"; 

// Definición de tipos
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
    const { id } = useParams(); // Clave del stream (ej: stream_xyz)
    const navigate = useNavigate();
    useBloqueo();

    // Estados de UI
    const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoadingStream, setIsLoadingStream] = useState(true);
    
    // Estados de Datos
    const [stream, setStream] = useState<StreamData | null>(null); 
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [userCoins, setUserCoins] = useState(0);

    // 1. Cargar Usuario y Monedas
    useEffect(() => {
        const localUser = getLocalUser();
        if (localUser) {
            setIsAuthorized(true);
            setUserCoins(localUser.coins || 0);
        }
    }, []);

    // 2. Función para cargar datos del Stream
    const fetchStreamData = async () => {
        if (!id) return;
        setIsLoadingStream(true);
        try {
            // Llamamos al backend usando la CLAVE de la URL
            const res = await fetch(`${BACKEND_URL}/stream/key/${id}`);
            
            if (res.ok) {
                const data = await res.json();
                console.log("✅ Stream cargado:", data);
                setStream(data); 
            } else {
                console.error("❌ Stream no encontrado");
                navigate("/discover"); // Si no existe, volver a la lista
            }
        } catch (e) {
            console.error("Error conexión:", e);
        } finally {
            setIsLoadingStream(false);
        }
    };

    // Carga inicial del stream
    useEffect(() => {
        fetchStreamData();
    }, [id, navigate]);

    // 3. Handler para abrir el modal
    const handleOpenGifts = () => {
        if (!isAuthorized) {
            navigate("/"); // Ir a login si no está logueado
            return;
        }
        // Opcional: refrescar datos del stream aquí si quieres
        setShowGiftModal(true);
    };

    // 4. Handler cuando se envía un regalo exitosamente
    const handleGiftSent = (newBalance: number) => {
        setUserCoins(newBalance);
        const localUser = getLocalUser();
        if (localUser) {
            localUser.coins = newBalance;
            localStorage.setItem("user", JSON.stringify(localUser));
            window.dispatchEvent(new Event("storage")); // Actualiza el header
        }
    };

    // Validaciones de renderizado
    if (!id) return <div className="bg-black text-white p-5">Error: ID no válido</div>;
    
    if (isLoadingStream) {
        return (
            <div className="bg-black min-vh-100 d-flex justify-content-center align-items-center text-white">
                <div className="spinner-border text-danger me-2" role="status"></div>
                Cargando transmisión...
            </div>
        );
    }

    return (
        <div className="bg-black min-vh-100 d-flex flex-column overflow-hidden text-white">
            <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />

            <div className="d-flex flex-grow-1" style={{ height: "calc(100vh - 80px)" }}>
                
                {/* ZONA IZQUIERDA: VIDEO */}
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

                    {/* CONTENEDOR DE VIDEO + OVERLAY */}
                    <div className="ratio ratio-16x9 shadow-lg position-relative" style={{ borderRadius: "12px", overflow: "hidden", flexGrow: 1, border: `1px solid ${WHITE_BORDER}`, background: "#000" }}>
                        
                        {/* 🔥 OVERLAY DE ANIMACIONES 🔥 */}
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
                        <p className="text-secondary small m-0 fw-bold">Streamer: {stream?.streamer.username || "Cargando..."}</p>
                    </div>
                </div>

                {/* ZONA DERECHA: CHAT */}
                <div className="col-lg-3" style={{ height: "100%", borderLeft: `1px solid ${WHITE_BORDER}` }}>
                    <div style={{ backgroundColor: "#121212", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                        
                        <div className="d-flex justify-content-between align-items-center" style={{ padding: "15px", borderBottom: `1px solid ${WHITE_BORDER}`, background: "#0b0b0b" }}>
                            <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px", color: "#888" }}>
                                Chat
                            </h6>
                            
                            {/* BOTÓN DE REGALOS */}
                            <Button 
                                variant="danger"
                                size="sm" 
                                onClick={handleOpenGifts} 
                                className="fw-bold d-flex align-items-center gap-2 border-0"
                                style={{ backgroundColor: '#EE1D52', borderRadius: '20px', padding: '5px 15px' }}
                                // Se deshabilita si no hay login o no cargó el stream
                                disabled={!isAuthorized || !stream} 
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
            {stream && (
                <GiftListModal 
                    show={showGiftModal} 
                    onHide={() => setShowGiftModal(false)} 
                    gifts={stream.gifts || []} 
                    streamId={stream.id} // Pasamos el ID numérico
                    userCoins={userCoins} 
                    onGiftSent={handleGiftSent} 
                />
            )}

            <style>{`
                .animate-pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default WatchPage;