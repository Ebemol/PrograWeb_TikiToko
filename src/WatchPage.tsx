import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Componentes
import Header from "./Componentes/Header";
import LiveChat from "./Componentes/Chat"; // Tu chat integrado
import useBloqueo from "../src/hooks/Bloqueo";

const WHITE_BORDER = "rgba(255, 255, 255, 0.15)";

const WatchPage: React.FC = () => {
  // 1. Capturamos el ID de la URL (ej: stream_l87lx1)
  const { id } = useParams(); 
  const navigate = useNavigate();
  useBloqueo();

  const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
  
  // Estado simple para verificar sesión (opcional, para mostrar chat o no)
  const [isAuthorized, setIsAuthorized] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setIsAuthorized(true);
  }, []);

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
                <p className="text-secondary small m-0 font-monospace">ID Sala: {id}</p>
            </div>
        </div>

        {/* ZONA DERECHA: EL CHAT */}
        <div className="col-lg-3" style={{ height: "100%", borderLeft: `1px solid ${WHITE_BORDER}` }}>
            <div style={{ backgroundColor: "#121212", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "15px", borderBottom: `1px solid ${WHITE_BORDER}`, background: "#0b0b0b" }}>
                <h6 className="mb-0 fw-bold text-uppercase" style={{ fontSize: "0.85rem", letterSpacing: "1px", color: "#888" }}>
                    Chat del Stream
                </h6>
              </div>

              <div style={{ flexGrow: 1, position: "relative" }}>
                {/* Si quieres que solo usuarios logueados chateen: */}
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
      
      <style>{`
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default WatchPage;