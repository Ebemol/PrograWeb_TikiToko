import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Componentes
import Header from "./Componentes/Header";
import LiveChat from "./Componentes/Chat";
import AuthRequired from "./Componentes/AuthRequired";
import useBloqueo from "./hooks/Bloqueo";

const WHITE_BORDER = "rgba(255, 255, 255, 0.15)";
const BACKEND_URL = "http://localhost:5002";

const GuestPage: React.FC = () => {
  const { id } = useParams(); // El ID de la sala (Clave del stream)
  const navigate = useNavigate();
  useBloqueo();

  // --- ESTADOS ---
  const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [streamData, setStreamData] = useState<any>(null);
  const [joined, setJoined] = useState(false); // Para mostrar botón "Unirse" antes de la cámara

  // 1. VERIFICAR AUTENTICACIÓN
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
        setIsAuthorized(true);
    }
    setLoadingAuth(false);
  }, []);

  // 2. VERIFICAR QUE EL STREAM EXISTE
  useEffect(() => {
    const checkStream = async () => {
        if (!id) return;
        try {
            const res = await fetch(`${BACKEND_URL}/stream/key/${id}`);
            if(res.ok) {
                const data = await res.json();
                setStreamData(data);
            } else {
                alert("El stream no existe o ha finalizado.");
                navigate("/feed");
            }
        } catch (e) {
            console.error(e);
        }
    };
    checkStream();
  }, [id, navigate]);

  // --- RENDERIZADO ---

  if (loadingAuth) return <div className="bg-black min-vh-100"></div>;

  // Bloqueo si no hay login
  if (!isAuthorized) {
    return (
        <div className="bg-black min-vh-100 d-flex flex-column">
            <Header showVentanaPerfil={false} setShowVentanaPerfil={() => {}} />
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <AuthRequired />
            </div>
        </div>
    );
  }

  // Pantalla de "Lobby" antes de entrar
  if (!joined) {
      return (
        <div className="bg-black min-vh-100 text-white d-flex flex-column">
            <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />
            
            <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
                <div className="text-center p-5 rounded-4 shadow-lg" style={{ border: `1px solid ${WHITE_BORDER}`, background: "#1e1e1e", maxWidth: "500px", width: "100%" }}>
                    <div className="mb-4">
                        <img 
                            src={streamData?.streamer?.avatar || "https://i.pravatar.cc/150"} 
                            alt="Host" 
                            className="rounded-circle border border-2 border-danger"
                            width="80" height="80"
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                    <h2 className="fw-bold mb-3">Invitación de Stream</h2>
                    <p className="text-secondary mb-4">
                        Te han invitado a participar en: <br/>
                        <strong className="text-white fs-5">{streamData?.titulo || "Cargando..."}</strong>
                    </p>
                    <button 
                        className="btn btn-danger btn-lg w-100 rounded-pill fw-bold" 
                        onClick={() => setJoined(true)}
                        disabled={!streamData}
                    >
                        <i className="bi bi-camera-video-fill me-2"></i> Unirse a la Cámara
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // PANTALLA DE STREAMING (INVITADO)
  return (
    <div className="bg-black min-vh-100 d-flex flex-column overflow-hidden text-white">
      <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />

      <div className="d-flex flex-grow-1" style={{ height: "calc(100vh - 80px)" }}>
        
        {/* IZQUIERDA: TU CÁMARA (INVITADO) */}
        <div className="col-lg-9 mb-4" style={{ height: "100%", padding: "20px", display: "flex", flexDirection: "column" }}>
            
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="badge bg-success animate-pulse px-3 py-2">🟢 ESTÁS EN EL AIRE (INVITADO)</div>
                <button className="btn btn-sm btn-outline-light" onClick={() => window.location.reload()}>Salir</button>
            </div>

            <div className="ratio ratio-16x9 shadow-lg" style={{ borderRadius: "12px", overflow: "hidden", flexGrow: 1, border: `1px solid ${WHITE_BORDER}`, background: "#000" }}>
                <iframe
                  // 🔥 LA MAGIA: ?room=CLAVE & push=GUEST_RANDOM
                  // Esto envía tu video a la sala del Host
                  src={`https://vdo.ninja/?room=${id}&push=Guest_${Math.floor(Math.random()*1000)}&webcam&microphone&autostart`}
                  allow="camera; microphone; autoplay; fullscreen"
                  frameBorder="0" width="100%" height="100%" title="Cámara Invitado"
                ></iframe>
            </div>
            
            <div className="mt-3 text-center text-secondary small">
                Estás compartiendo cámara con <strong>{streamData?.streamer?.username}</strong>
            </div>
        </div>

        {/* DERECHA: CHAT */}
        <div className="col-lg-3" style={{ height: "100%", borderLeft: `1px solid ${WHITE_BORDER}` }}>
            <div style={{ backgroundColor: "#121212", height: "100%", display: "flex", flexDirection: "column" }}>
               <div style={{ padding: "15px", borderBottom: `1px solid ${WHITE_BORDER}`, background: "#0b0b0b" }}>
                   <h6 className="m-0 fw-bold text-uppercase small">Chat del Stream</h6>
               </div>
               <div style={{ flexGrow: 1, position: "relative" }}>
                   <LiveChat />
               </div>
            </div>
        </div>

      </div>
      
      <style>{`
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.8; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default GuestPage;