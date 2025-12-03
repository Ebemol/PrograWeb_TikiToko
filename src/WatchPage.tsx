import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Button } from 'react-bootstrap';

// Componentes
import Header from "./Componentes/Header";
import LiveChat from "./Componentes/Chat"; // Tu chat integrado
import GiftListModal from "./Componentes/GiftListModal"; // <-- NUEVO: Importamos el modal
import useBloqueo from "../src/hooks/Bloqueo";

const WHITE_BORDER = "rgba(255, 255, 255, 0.15)";
const BACKEND_URL = "http://localhost:5002"; // <-- Asegúrate de que esta URL sea correcta

// Define la interfaz para los regalos y el stream
interface Gift {
    nombre: string;
    costo: number;
    emoji: string;
}

interface StreamData {
    id: number;
    titulo: string;
    clave: string;
    isLive: boolean;
    gifts: Gift[]; // Los regalos vienen incluidos
    streamer: {
        id: number;
        username: string;
        avatar: string | null;
    };
}

const WatchPage: React.FC = () => {
    const { id } = useParams(); // ID de la claveStream (ej: stream_l87lx1)
    const navigate = useNavigate();
    useBloqueo();

    const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    // ESTADOS NUEVOS PARA LA FUNCIONALIDAD DE REGALOS
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [stream, setStream] = useState<StreamData | null>(null); // Estado para guardar los datos del stream y los regalos
    
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) setIsAuthorized(true);
        
        // FUNCIÓN PARA OBTENER LOS DATOS DEL STREAM Y REGALOS
        const fetchStreamData = async () => {
            if (!id) return;

            try {
                // El backend ya tiene la ruta GET /stream/:clave que incluye los gifts.
                const response = await fetch(`${BACKEND_URL}/stream/${id}`);
                
                if (!response.ok) {
                    throw new Error("Stream no encontrado o inactivo.");
                }
                
                const data: StreamData = await response.json();
                setStream(data); // Guarda todos los datos, incluyendo la lista de regalos
            } catch (error) {
                console.error("Error al obtener datos del stream:", error);
                // Aquí podrías redirigir o mostrar un mensaje de error
                // navigate("/viewer"); 
            }
        };

        fetchStreamData();
    }, [id, navigate]); // Dependencias: el ID de la URL

    if (!id) return <div className="bg-black text-white p-5">Error: ID no válido</div>;

    return (
        <div className="bg-black min-vh-100 d-flex flex-column overflow-hidden text-white">
            <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />

            <div className="d-flex flex-grow-1" style={{ height: "calc(100vh - 80px)" }}>
                
                {/* ZONA IZQUIERDA: EL VIDEO */}
                <div className="col-lg-9 mb-4" style={{ height: "100%", padding: "20px", display: "flex", flexDirection: "column" }}>
                    
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <button 
                            className="btn btn-sm btn-outline-secondary text-white border-0 d-flex align-items-center gap-2" 
                            onClick={() => navigate("/viewer")} // O "/feed"
                            style={{ background: "#1f1f1f" }}
                        >
                            <i className="bi bi-arrow-left"></i> Volver
                        </button>
                        <div className="badge bg-danger animate-pulse">🔴 EN VIVO</div>
                    </div>

                    {/* --- IFRAME VDO.NINJA (EL REPRODUCTOR) --- */}
                    <div className="ratio ratio-16x9 shadow-lg" style={{ borderRadius: "12px", overflow: "hidden", flexGrow: 1, border: `1px solid ${WHITE_BORDER}`, background: "#000" }}>
                        <iframe
                            // LA CLAVE: ?view=${id} conecta con el que tiene ?push=${id}
                            src={`https://vdo.ninja/?view=${id}&autoplay&clean&controls=0`} 
                            allow="autoplay; fullscreen; picture-in-picture"
                            style={{ width: "100%", height: "100%", border: "none" }}
                            title="Stream Viewer"
                        ></iframe>
                    </div>

                    <div className="mt-3 px-2">
                        <h4 className="m-0">{stream?.titulo || 'Cargando...'}</h4> {/* Muestra el título del stream */}
                        <p className="text-secondary small m-0 font-monospace">Streamer: **{stream?.streamer?.username || 'N/A'}** | ID Sala: {id}</p>
                    </div>
                </div>

                {/* ZONA DERECHA: EL CHAT */}
                <div className="col-lg-3" style={{ height: "100%", borderLeft: `1px solid ${WHITE_BORDER}` }}>
                    <div style={{ backgroundColor: "#121212", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                        <div className="d-flex justify-content-between align-items-center" style={{ padding: "15px", borderBottom: `1px solid ${WHITE_BORDER}`, background: "#0b0b0b" }}>
                            <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px", color: "#888" }}>
                                Chat del Stream
                            </h6>
                            {/* --- BOTÓN DE REGALOS --- */}
                            <Button 
                                variant="info" 
                                size="sm" 
                                onClick={() => setShowGiftModal(true)}
                                className="fw-bold"
                                style={{
                                    backgroundColor: '#FF5733', // Color de acento
                                    borderColor: '#FF5733',
                                    color: 'white',
                                    borderRadius: '8px'
                                }}
                                disabled={!stream} // Deshabilita si no se han cargado los datos del stream
                            >
                                🎁 Regalos
                            </Button>
                            {/* --------------------------- */}
                        </div>

                        <div style={{ flexGrow: 1, position: "relative" }}>
                            {isAuthorized ? (
                                <LiveChat />
                            ) : (
                                <div className="d-flex align-items-center justify-content-center h-100 text-secondary">
                                    Inicia sesión para chatear
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            
            {/* --- MODAL DE REGALOS --- */}
            <GiftListModal 
                show={showGiftModal} 
                onHide={() => setShowGiftModal(false)} 
                gifts={stream?.gifts || []} // Pasa la lista de regalos al modal
            />
            {/* ------------------------ */}

            <style>{`
                .animate-pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default WatchPage;