import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Componentes
import Header from "./Componentes/Header";
import useBloqueo from "./hooks/Bloqueo";
import AuthRequired from "./Componentes/AuthRequired";

const RED = "#EE1D52";

const DiscoverLivePage: React.FC = () => {
  const navigate = useNavigate();
  useBloqueo();

  // --- ESTADOS ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
  
  const [activeStreams, setActiveStreams] = useState<any[]>([]);
  const [loadingStreams, setLoadingStreams] = useState(true);

  // --- 1. SEGURIDAD ---
  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthorized(!!user);
    setLoadingAuth(false);
  }, []);

  // --- 2. CARGAR STREAMS ---
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch("http://localhost:5002/streams/live");
        if (res.ok) {
          const data = await res.json();
          setActiveStreams(data);
        }
      } catch (error) {
        console.error("Error cargando streams", error);
      } finally {
        setLoadingStreams(false);
      }
    };

    if (isAuthorized) {
        fetchStreams();
        const interval = setInterval(fetchStreams, 5000);
        return () => clearInterval(interval);
    }
  }, [isAuthorized]);

  // --- 3. FUNCIÓN PARA VER STREAM ---
  const handleWatchStream = (stream: any) => {
    // Priorizamos la CLAVE (que es lo que usa VDO.Ninja), si no hay, usamos ID
    const streamId = stream.clave || stream.id;
    
    if (streamId) {
        navigate(`/ver/${streamId}`);
    } else {
        console.error("Stream sin ID válido:", stream);
    }
  };

  // --- RENDERIZADO ---

  if (loadingAuth) return <div className="bg-black min-vh-100"></div>;

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

  return (
    <div className="bg-black min-vh-100 text-white font-sans">
      <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />
      
      <div className="container py-5">
        
        <div className="d-flex justify-content-between align-items-end mb-5 border-bottom border-secondary border-opacity-25 pb-3">
            <div>
                <h2 className="fw-bold mb-1">🔴 Explorar Lives</h2>
                <p className="text-secondary m-0">Mira lo que está pasando ahora mismo</p>
            </div>
            <button className="btn btn-danger fw-bold rounded-pill px-4" onClick={() => navigate("/golive")}>
                <i className="bi bi-camera-video me-2"></i>Emitir
            </button>
        </div>

        {/* --- LISTA DE STREAMS --- */}
        {loadingStreams ? (
            <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status"></div>
                <p className="mt-3 text-secondary">Buscando señales...</p>
            </div>
        ) : activeStreams.length === 0 ? (
            <div className="text-center py-5 rounded-4" style={{ border: "1px dashed #333", background: "#0b0b0b" }}>
                <i className="bi bi-broadcast display-1 text-secondary mb-3 d-block opacity-25"></i>
                <h4 className="text-white">Todo está tranquilo...</h4>
                <p className="text-secondary">Nadie está transmitiendo en este momento.</p>
                <button className="btn btn-outline-light mt-2" onClick={() => navigate("/golive")}>
                    ¡Sé el primero!
                </button>
            </div>
        ) : (
            <div className="row g-4">
                {activeStreams.map((stream) => (
                    <div key={stream.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                        <div 
                            className="card h-100 border-0 shadow-lg stream-card overflow-hidden position-relative"
                            style={{ backgroundColor: "#1e1e1e", borderRadius: "16px", cursor: "pointer", transition: "all 0.3s" }}
                            onClick={() => handleWatchStream(stream)} // <--- CLIC SEGURO
                        >
                            <div className="ratio ratio-16x9 bg-black">
                                <img 
                                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${stream.titulo}`} 
                                    alt="Thumbnail"
                                    style={{ objectFit: "cover", opacity: 0.7 }}
                                />
                                <div className="position-absolute top-0 start-0 m-2 badge bg-danger animate-pulse shadow">
                                    EN VIVO
                                </div>
                                <div className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75 backdrop-blur">
                                    <i className="bi bi-eye-fill me-1"></i> {Math.floor(Math.random() * 100) + 1}
                                </div>
                            </div>

                            <div className="card-body d-flex align-items-center gap-3 p-3">
                                <div className="position-relative">
                                    <img 
                                        src={stream.streamer?.avatar || "https://i.pravatar.cc/150"} 
                                        alt="Avatar" 
                                        className="rounded-circle"
                                        width="45" height="45"
                                        style={{ objectFit: "cover", border: `2px solid ${RED}` }}
                                    />
                                </div>
                                <div className="overflow-hidden">
                                    <h6 className="card-title mb-1 fw-bold text-white text-truncate">{stream.titulo}</h6>
                                    <small className="text-secondary d-block">{stream.streamer?.username || "Usuario"}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

      </div>

      <style>{`
        .stream-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(238, 29, 82, 0.2) !important; }
        .animate-pulse { animation: pulse 2s infinite; }
        .backdrop-blur { backdrop-filter: blur(4px); }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default DiscoverLivePage;