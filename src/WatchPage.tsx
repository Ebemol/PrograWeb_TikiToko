import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap'; // <-- Asegúrate de que Button está importado
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Componentes
import Header from "./Componentes/Header";
import LiveChat from "./Componentes/Chat"; // Tu chat integrado
import GiftListModal from "./Componentes/GiftListModal"; 
import useBloqueo from "../src/hooks/Bloqueo";

const WHITE_BORDER = "rgba(255, 255, 255, 0.15)";
const BACKEND_URL = "http://localhost:5002"; 

interface Gift {
    id: number; // <-- Asegúrate de que tu interfaz en WatchPage también tenga ID
    nombre: string;
    costo: number;
    emoji: string;
}

interface StreamData {
    id: number; // El ID del Stream
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

// Función para obtener los datos del usuario logueado
const getLocalUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
};


const WatchPage: React.FC = () => {
    const { id } = useParams(); // Clave del stream (ej: stream_l87lx1)
    const navigate = useNavigate();
    useBloqueo();

    const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    
    // ESTADOS CLAVE
    const [stream, setStream] = useState<StreamData | null>(null); 
    const [showGiftModal, setShowGiftModal] = useState(false);
    // Estado para las monedas, inicializado desde el localStorage
    const [userCoins, setUserCoins] = useState(getLocalUser()?.coins || 0);

    // FUNCIÓN PARA ACTUALIZAR MONEDAS EN ESTADO Y LOCALSTORAGE
    const handleGiftSent = (newBalance: number) => {
        setUserCoins(newBalance);
        
        // Actualizar el localStorage del usuario para reflejar el nuevo saldo
        const localUser = getLocalUser();
        if (localUser) {
            localUser.coins = newBalance;
            localStorage.setItem("user", JSON.stringify(localUser));
        }
    };
    
    useEffect(() => {
        const localUser = getLocalUser();
        if (localUser) {
            setIsAuthorized(true);
            // Si el userCoins no se ha cargado, o el valor del localStorage es diferente, actualiza
            if (userCoins !== localUser.coins) {
                 setUserCoins(localUser.coins);
            }
        }
        
        // FUNCIÓN PARA OBTENER LOS DATOS DEL STREAM Y REGALOS
        const fetchStreamData = async () => {
            if (!id) return;

            try {
                // Esta ruta GET /stream/:clave ya devuelve el 'id' del stream y los 'gifts'.
                const response = await fetch(`${BACKEND_URL}/stream/${id}`);
                
                if (!response.ok) {
                    throw new Error("Stream no encontrado o inactivo.");
                }
                
                const data: StreamData = await response.json();
                
                // Asegúrate de que los regalos tengan el campo 'id'
              // Esto es crucial para que la compra funcione en el frontend
              // Asegúrate de que los regalos tengan el campo 'id'
              if (data.gifts && data.gifts.length > 0) {
                // Mantenemos solo el mapeo para asegurar la interfaz de TypeScript,
                // pero confiamos en que 'id' viene del backend.
                const giftsWithId: Gift[] = data.gifts.map((g: any) => ({
                  id: g.id, // <-- ¡Ya no necesitamos Math.random()!
                  nombre: g.nombre,
                  costo: g.costo,
                  emoji: g.emoji
                }));
                data.gifts = giftsWithId;
              }
                
                setStream(data); 
            } catch (error) {
                console.error("Error al obtener datos del stream:", error);
            }
        };

        fetchStreamData();
    }, [id, navigate]); 

    if (!id) return <div className="bg-black text-white p-5">Error: ID no válido</div>;

    return (
        <div className="bg-black min-vh-100 d-flex flex-column overflow-hidden text-white">
            <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />

            <div className="d-flex flex-grow-1" style={{ height: "calc(100vh - 80px)" }}>
                
                {/* ZONA IZQUIERDA: EL VIDEO */}
                <div className="col-lg-9 mb-4" style={{ height: "100%", padding: "20px", display: "flex", flexDirection: "column" }}>
                    {/* ... (código para el reproductor) ... */}
                    
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <button 
                            className="btn btn-sm btn-outline-secondary text-white border-0 d-flex align-items-center gap-2" 
                            onClick={() => navigate("/viewer")} 
                            style={{ background: "#1f1f1f" }}
                        >
                            <i className="bi bi-arrow-left"></i> Volver
                        </button>
                        <div className="badge bg-danger animate-pulse">🔴 EN VIVO</div>
                    </div>

                    {/* --- IFRAME VDO.NINJA (EL REPRODUCTOR) --- */}
                    <div className="ratio ratio-16x9 shadow-lg" style={{ borderRadius: "12px", overflow: "hidden", flexGrow: 1, border: `1px solid ${WHITE_BORDER}`, background: "#000" }}>
                        <iframe
                            src={`https://vdo.ninja/?view=${id}&autoplay&clean&controls=0`} 
                            allow="autoplay; fullscreen; picture-in-picture"
                            style={{ width: "100%", height: "100%", border: "none" }}
                            title="Stream Viewer"
                        ></iframe>
                    </div>

                    <div className="mt-3 px-2">
                        <h4 className="m-0">{stream?.titulo || 'Cargando...'}</h4>
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
                                onClick={() => isAuthorized ? setShowGiftModal(true) : navigate("/login")} // Redirigir si no está autorizado
                                className="fw-bold"
                                style={{
                                    backgroundColor: '#FF5733', 
                                    borderColor: '#FF5733',
                                    color: 'white',
                                    borderRadius: '8px'
                                }}
                                disabled={!stream} 
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
                                    <Button onClick={() => navigate("/")} variant="success">Iniciar sesión para chatear</Button>
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
                gifts={stream?.gifts || []} // La lista de regalos
                streamId={stream?.id || null} // El ID del stream (necesario para el backend)
                userCoins={userCoins} // Las monedas del usuario
                onGiftSent={handleGiftSent} // La función para actualizar las monedas después de enviar
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