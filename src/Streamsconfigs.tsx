import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Componentes
import Header from "./Componentes/Header";
import LiveChat from "./Componentes/Chat";
import AuthRequired from "./Componentes/AuthRequired"; 
import useBloqueo from "./hooks/Bloqueo"; 

const RED = "#EE1D52";
const WHITE_BORDER = "rgba(255, 255, 255, 0.15)";

// Regalos por defecto
const DEFAULT_GIFTS = [
  { nombre: "Rosa", cost: 10, emoji: "🌹" },
  { nombre: "Café", cost: 25, emoji: "☕" },
  { nombre: "Gorra", cost: 50, emoji: "🧢" },
  { nombre: "TikTok", cost: 100, emoji: "🎵" },
];

const GoLivePage: React.FC = () => {
  const navigate = useNavigate();
  useBloqueo(); 

  // --- SEGURIDAD ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setIsAuthorized(true);
      setUserProfile(JSON.parse(stored));
    } else {
      setIsAuthorized(false);
    }
    setLoadingAuth(false);
  }, []);

  // --- ESTADOS ---
  const [paso, setPaso] = useState<"config" | "live">("config");
  const [titulo, setTitulo] = useState("");
  const [claveStream, setClaveStream] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Estados Regalos Config
  const [gifts, setGifts] = useState(DEFAULT_GIFTS);
  const [newGiftName, setNewGiftName] = useState("");
  const [newGiftCost, setNewGiftCost] = useState("");
  const [newGiftEmoji, setNewGiftEmoji] = useState("🎁");
  const [showGiftsConfig, setShowGiftsConfig] = useState(false);

  // Generar clave automática
  useEffect(() => {
    const randomId = "stream_" + Math.random().toString(36).substr(2, 6);
    setClaveStream(randomId);
  }, []);

  // --- LÓGICA REGALOS ---
  const handleAddGift = () => {
    if (!newGiftName || !newGiftCost) return;
    setGifts([...gifts, { nombre: newGiftName, cost: Number(newGiftCost), emoji: newGiftEmoji }]);
    setNewGiftName("");
    setNewGiftCost("");
  };

  const handleRemoveGift = (index: number) => {
    setGifts(gifts.filter((_, i) => i !== index));
  };

  // --- INICIAR STREAM ---
  const handleStartStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !claveStream.trim()) return;

    setIsLoading(true);
    try {
      const resp = await fetch("http://localhost:5002/stream/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userProfile?.id || 1,
          titulo: titulo,
          claveStream: claveStream,
          gifts: gifts
        })
      });

      if (resp.ok) {
        // Obtenemos la respuesta del backend (que ahora incluye clave y totalGifts)
        const data = await resp.json();
        console.log("Respuesta del Backend (Stream/Start):", data); 
        setPaso("live");
      } else {
        alert("Error al iniciar.");
      }
    } catch (error) {
      console.error(error);
      // Si falla la conexión local, permitimos entrar para probar la UI
      setPaso("live"); 
    } finally {
      setIsLoading(false);
    }
  };

  // --- FINALIZAR STREAM (NUEVA FUNCIÓN) ---
  const handleStopStream = async () => {
    if (!window.confirm("¿Seguro que quieres finalizar la transmisión?")) return;

    try {
        // Avisamos al backend para que apague el stream en la DB
        await fetch("http://localhost:5002/stream/end", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userProfile?.id })
        });
    } catch (error) {
        console.error("Error al finalizar:", error);
    } finally {
        // Recargamos la página para volver al inicio
        window.location.reload();
    }
  };

  const copiarLink = () => {
    const link = `http://localhost:5173/ver/${claveStream}`;
    navigator.clipboard.writeText(link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // --- ESTILOS ---
  const inputStyle: React.CSSProperties = {
    background: "#121212", 
    border: `1px solid ${WHITE_BORDER}`, 
    color: "#fff", 
    borderRadius: 8, 
    padding: "10px 15px", 
    width: "100%", 
    outline: "none",
  };

  // --- RENDER ---
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

  // === MODO 1: CONFIGURACIÓN ===
  if (paso === "config") {
    return (
      <div className="bg-black min-vh-100 text-white font-sans d-flex flex-column">
        <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />
        
        <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3">
          <div style={{ maxWidth: "500px", width: "100%" }}>
            
            {/* Tarjeta Principal Plana */}
            <div className="p-4 rounded-4" 
                 style={{ border: `1px solid ${WHITE_BORDER}`, background: "#1e1e1e" }}>

                <div className="text-center mb-4">
                    <div style={{ width: 70, height: 70, background: "#121212", borderRadius: "50%", margin: "0 auto 15px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${WHITE_BORDER}` }}>
                        <i className="bi bi-broadcast" style={{ fontSize: "2rem", color: RED }}></i>
                    </div>
                    <h2 className="fw-bold">Iniciar Live</h2>
                </div>

                <form onSubmit={handleStartStream}>
                    <div className="mb-3">
                        <label className="text-secondary small fw-bold mb-2">TÍTULO</label>
                        <input style={inputStyle} placeholder="Ej: Jugando un rato..." value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <label className="text-secondary small fw-bold mb-2 d-flex justify-content-between">
                            <span>CLAVE DE STREAM</span>
                            <span 
                                style={{ color: RED, cursor: "pointer", fontSize: "0.8rem" }} 
                                onClick={() => setClaveStream("stream_" + Math.random().toString(36).substr(2, 6))}
                            >
                                Generar nueva
                            </span>
                        </label>
                        <input style={inputStyle} value={claveStream} onChange={(e) => setClaveStream(e.target.value)} required />
                    </div>

                    {/* Sección Regalos Simple */}
                    <div className="mb-4">
                        <div 
                            className="d-flex justify-content-between align-items-center p-3 rounded-3" 
                            style={{ background: "#121212", border: `1px solid ${WHITE_BORDER}`, cursor: "pointer" }}
                            onClick={() => setShowGiftsConfig(!showGiftsConfig)}
                        >
                            <span className="small fw-bold"><i className="bi bi-gift-fill me-2 text-secondary"></i>Configurar Regalos</span>
                            <i className={`bi bi-chevron-${showGiftsConfig ? "up" : "down"} text-secondary`}></i>
                        </div>

                        {showGiftsConfig && (
                            <div className="mt-2 p-3 rounded-3" style={{ border: `1px solid ${WHITE_BORDER}`, background: "#121212" }}>
                                <div className="d-flex gap-2 mb-3">
                                    <input placeholder="Nombre" style={{...inputStyle, padding: "6px 10px"}} value={newGiftName} onChange={e => setNewGiftName(e.target.value)} />
                                    <input type="number" placeholder="$" style={{...inputStyle, padding: "6px 10px", width: "70px"}} value={newGiftCost} onChange={e => setNewGiftCost(e.target.value)} />
                                    <select style={{...inputStyle, padding: "6px", width: "60px", cursor: "pointer"}} value={newGiftEmoji} onChange={e => setNewGiftEmoji(e.target.value)}>
                                        <option>🎁</option><option>🌹</option><option>🔥</option><option>🎉</option><option>💎</option>
                                    </select>
                                    <button type="button" className="btn btn-sm btn-light fw-bold" onClick={handleAddGift}>+</button>
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {gifts.map((g, i) => (
                                        <span key={i} className="badge bg-dark border border-secondary p-2 d-flex align-items-center gap-2">
                                            {g.emoji} {g.nombre} <small className="text-secondary">({g.cost})</small>
                                            <i className="bi bi-x text-danger" style={{ cursor: "pointer" }} onClick={() => handleRemoveGift(i)}></i>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="btn w-100 py-3 rounded-3 fw-bold text-white"
                        disabled={isLoading}
                        style={{ background: RED, border: "none", fontSize: "1.1rem" }}
                    >
                        {isLoading ? "Iniciando..." : "EMITIR AHORA"}
                    </button>
                </form>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // === MODO 2: EN VIVO (DASHBOARD) ===
  return (
    <div className="bg-black min-vh-100 d-flex flex-column overflow-hidden text-white">
      <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />

      <div className="d-flex flex-grow-1" style={{ height: "calc(100vh - 80px)" }}>
        
        {/* ZONA IZQUIERDA (VIDEO + INFO) */}
        <div className="col-lg-9 mb-4" style={{ height: "100%", padding: "20px", display: "flex", flexDirection: "column" }}>
            
            {/* Video Iframe */}
            <div className="ratio ratio-16x9" style={{ borderRadius: "12px", overflow: "hidden", flexGrow: 1, border: `1px solid ${WHITE_BORDER}`, background: "#000" }}>
                <iframe
                  src={`https://vdo.ninja/?push=${claveStream}&webcam&microphone&autostart`}
                  allow="camera; microphone; autoplay; fullscreen"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  title="Tu Cámara"
                ></iframe>
            </div>

            {/* Barra Info */}
            <div style={{ backgroundColor: "#1e1e1e", borderRadius: "12px", padding: "20px", marginTop: "15px" }}>
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <img src={userProfile?.avatar || "https://i.pravatar.cc/150"} alt="Avatar" className="rounded-circle me-3" width="60" height="60" style={{objectFit: "cover"}} />
                        <div>
                            <h4 className="mb-1 fw-bold">{userProfile?.username || "Tú"}</h4>
                            <p className="mb-0" style={{ fontSize: "14px" }}>
                                <span className="badge bg-danger me-2 animate-pulse">🔴 EN VIVO</span>
                                <span className="text-secondary">Clave: {claveStream}</span>
                            </p>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button 
                            className={`btn ${copiado ? "btn-success" : "btn-outline-light"} d-flex align-items-center gap-2`} 
                            onClick={copiarLink}
                        >
                            {copiado ? <i className="bi bi-check-lg"></i> : <i className="bi bi-share-fill"></i>}
                            <span>{copiado ? "Copiado" : "Compartir"}</span>
                        </button>
                        {/* BOTÓN FINALIZAR CONECTADO */}
                        <button className="btn btn-danger" onClick={handleStopStream}>
                            Finalizar
                        </button>
                    </div>
                </div>
                <div className="mt-3">
                     <h5 className="fw-semibold">{titulo}</h5>
                </div>
            </div>
        </div>

        {/* ZONA DERECHA (CHAT) */}
        <div className="col-lg-3" style={{ height: "100%" }}>
            <div style={{ backgroundColor: "#1e1e1e", borderRadius: "12px", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "15px", borderBottom: "1px solid #333" }}>
                <h5 className="mb-0 fw-bold">Chat en vivo</h5>
              </div>

              <div style={{ flexGrow: 1, position: "relative" }}>
                <LiveChat />
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

export default GoLivePage;