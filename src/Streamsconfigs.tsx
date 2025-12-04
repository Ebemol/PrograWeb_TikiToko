import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Componentes
import Header from "./Componentes/Header";
import LiveChat from "./Componentes/Chat";
import AuthRequired from "./Componentes/AuthRequired"; 
import GiftOverlay from "./Componentes/GiftOverlay"; 
import useBloqueo from "./hooks/Bloqueo"; 

const RED = "#EE1D52";
const WHITE_BORDER = "rgba(255, 255, 255, 0.15)";

// Interface regalos
interface GiftItem {
  nombre: string;
  cost: number;
  emoji: string;
  image?: string | null;
}

const DEFAULT_GIFTS: GiftItem[] = [
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

  // Estados Regalos
  const [gifts, setGifts] = useState<GiftItem[]>(DEFAULT_GIFTS);
  const [newGiftName, setNewGiftName] = useState("");
  const [newGiftCost, setNewGiftCost] = useState("");
  const [newGiftEmoji, setNewGiftEmoji] = useState("🎁");
  const [newGiftImage, setNewGiftImage] = useState<string | null>(null);
  const [showGiftsConfig, setShowGiftsConfig] = useState(false);

  useEffect(() => {
    const randomId = "stream_" + Math.random().toString(36).substr(2, 6);
    setClaveStream(randomId);
  }, []);

  // --- LÓGICA ---
  const handleGiftImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) return alert("Imagen muy pesada (Máx 2MB)");
      const reader = new FileReader();
      reader.onload = (event) => setNewGiftImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddGift = () => {
    if (!newGiftName || !newGiftCost) return;
    setGifts([...gifts, { nombre: newGiftName, cost: Number(newGiftCost), emoji: newGiftEmoji, image: newGiftImage }]);
    setNewGiftName("");
    setNewGiftCost("");
    setNewGiftImage(null);
  };

  const handleRemoveGift = (index: number) => {
    setGifts(gifts.filter((_, i) => i !== index));
  };

  const resetGifts = () => {
    setGifts(DEFAULT_GIFTS);
  };

  const handleStartStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !claveStream.trim()) return;

    setIsLoading(true);
    try {
      const resp = await fetch("https://prograweb-tikitoko-backend-lw2q.onrender.com/stream/start", {
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
        setPaso("live");
      } else {
        alert("Error al iniciar el stream.");
      }
    } catch (error) {
      console.error(error);
      setPaso("live");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopStream = async () => {
    if (!window.confirm("¿Finalizar transmisión?")) return;
    try {
        await fetch("https://prograweb-tikitoko-backend-lw2q.onrender.com/stream/end", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userProfile?.id })
        });
    } catch (error) { console.error(error); } 
    finally { window.location.reload(); }
  };

  // Copiar enlace para ESPECTADORES
  const copiarLink = () => {
    const link = `${window.location.origin}/#/ver/${claveStream}`;
    navigator.clipboard.writeText(link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // 🔥 NUEVO: Copiar enlace para INVITADOS
  const copiarLinkInvitado = () => {
    const link = `${window.location.origin}/#/guest/${claveStream}`;
    navigator.clipboard.writeText(link);
    alert("✅ Enlace de INVITADO copiado.\n\nMándaselo a tu amigo para que entre a la cámara.");
  };

  const inputStyle: React.CSSProperties = {
    background: "#0b0b0b", border: `1px solid ${WHITE_BORDER}`, color: "#fff", borderRadius: 8, padding: "10px 15px", width: "100%", outline: "none",
  };

  if (loadingAuth) return <div className="bg-black min-vh-100"></div>;

  if (!isAuthorized) {
    return (
      <div className="bg-black min-vh-100 d-flex flex-column">
        <Header showVentanaPerfil={false} setShowVentanaPerfil={() => {}} />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center"><AuthRequired /></div>
      </div>
    );
  }

  // === CONFIGURACIÓN ===
  if (paso === "config") {
    return (
      <div className="bg-black min-vh-100 text-white font-sans d-flex flex-column">
        <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />
        <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3">
          <div style={{ maxWidth: "500px", width: "100%" }}>
            <div className="p-4 rounded-4" style={{ border: `1px solid ${WHITE_BORDER}`, background: "#1e1e1e" }}>
                <div className="text-center mb-4">
                    <div style={{ width: 70, height: 70, background: "#121212", borderRadius: "50%", margin: "0 auto 15px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${WHITE_BORDER}` }}>
                        <i className="bi bi-broadcast" style={{ fontSize: "2rem", color: RED }}></i>
                    </div>
                    <h2 className="fw-bold">Iniciar Live</h2>
                </div>
                <form onSubmit={handleStartStream}>
                    <div className="mb-3">
                        <label className="text-secondary small fw-bold mb-2">TÍTULO</label>
                        <input style={inputStyle} placeholder="Ej: Jugando..." value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label className="text-secondary small fw-bold mb-2 d-flex justify-content-between">
                            <span>CLAVE DE STREAM</span>
                            <span style={{ color: RED, cursor: "pointer", fontSize: "0.8rem" }} onClick={() => setClaveStream("stream_" + Math.random().toString(36).substr(2, 6))}>Generar nueva</span>
                        </label>
                        <input style={inputStyle} value={claveStream} onChange={(e) => setClaveStream(e.target.value)} required />
                    </div>

                    {/* Config Regalos */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ background: "#121212", border: `1px solid ${WHITE_BORDER}`, cursor: "pointer" }} onClick={() => setShowGiftsConfig(!showGiftsConfig)}>
                            <span className="small fw-bold"><i className="bi bi-gift-fill me-2 text-secondary"></i>Configurar Regalos</span>
                            <i className={`bi bi-chevron-${showGiftsConfig ? "up" : "down"} text-secondary`}></i>
                        </div>
                        {showGiftsConfig && (
                            <div className="mt-2 p-3 rounded-3" style={{ border: `1px solid ${WHITE_BORDER}`, background: "#121212" }}>
                                <div className="d-flex gap-2 mb-3 align-items-center">
                                    <input placeholder="Nombre" style={{...inputStyle, padding: "6px 10px"}} value={newGiftName} onChange={e => setNewGiftName(e.target.value)} />
                                    <input type="number" placeholder="$" style={{...inputStyle, padding: "6px 10px", width: "70px"}} value={newGiftCost} onChange={e => setNewGiftCost(e.target.value)} />
                                    <label className="btn btn-sm d-flex align-items-center justify-content-center" style={{ background: "#1a1a1a", border: `1px solid ${WHITE_BORDER}`, color: "white", width: "40px", height: "36px", cursor: "pointer", margin: 0 }}>
                                        {newGiftImage ? <img src={newGiftImage} width="20" /> : <i className="bi bi-image"></i>}
                                        <input type="file" hidden accept="image/*" onChange={handleGiftImageChange} />
                                    </label>
                                    <button type="button" className="btn btn-sm btn-light fw-bold" onClick={handleAddGift}>+</button>
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                    {gifts.map((g, i) => (
                                        <span key={i} className="badge bg-dark border border-secondary p-2 d-flex align-items-center gap-2">
                                            {g.image ? <img src={g.image} width="15" /> : g.emoji} {g.nombre} <small className="text-secondary">({g.cost})</small>
                                            <i className="bi bi-x text-danger" style={{ cursor: "pointer" }} onClick={() => handleRemoveGift(i)}></i>
                                        </span>
                                    ))}
                                </div>
                                <button type="button" className="btn btn-link btn-sm text-secondary p-0 mt-3 small" onClick={() => setGifts(DEFAULT_GIFTS)}>Restablecer default</button>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn w-100 py-3 rounded-3 fw-bold text-white shadow-lg" disabled={isLoading} style={{ background: RED, border: "none", fontSize: "1.1rem" }}>
                        {isLoading ? "Iniciando..." : "EMITIR AHORA"}
                    </button>
                </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === EN VIVO ===
  return (
    <div className="bg-black min-vh-100 d-flex flex-column overflow-hidden text-white">
      <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />

      <div className="d-flex flex-grow-1" style={{ height: "calc(100vh - 80px)" }}>
        <div className="col-lg-9 mb-4" style={{ height: "100%", padding: "20px", display: "flex", flexDirection: "column" }}>
            
            <div style={{ backgroundColor: "#1e1e1e", borderRadius: "12px", padding: "12px 20px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${WHITE_BORDER}` }}>
                <div className="d-flex align-items-center gap-3">
                    <img src={userProfile?.avatar || "https://i.pravatar.cc/150"} alt="Avatar" className="rounded-circle" width="45" height="45" style={{objectFit: "cover", border: "2px solid #333"}} />
                    <div>
                        <h5 className="m-0 fw-bold fs-6">{userProfile?.username || "Usuario"}</h5>
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-danger animate-pulse d-flex align-items-center gap-1" style={{ fontSize: "0.7rem" }}>🔴 LIVE</span>
                            <span className="text-white-50 small text-truncate">{titulo}</span>
                        </div>
                    </div>
                </div>
                
                <div className="d-flex gap-2">
                    {/* BOTÓN INVITAR (NUEVO) */}
                    <button 
                        className="btn btn-sm btn-outline-info d-flex align-items-center gap-2 border-0 text-white" 
                        onClick={copiarLinkInvitado} 
                        style={{ background: "rgba(13, 110, 253, 0.2)" }}
                        title="Invitar a alguien a transmitir contigo"
                    >
                        <i className="bi bi-person-plus-fill"></i>
                        <span className="d-none d-md-inline">Invitar</span>
                    </button>

                    {/* BOTÓN COMPARTIR LINK */}
                    <button 
                        className={`btn btn-sm ${copiado ? "btn-success" : "btn-outline-secondary"} d-flex align-items-center gap-2 border-0 text-white`} 
                        onClick={copiarLink}
                        style={{ background: "#1f1f1f" }}
                    >
                        {copiado ? <i className="bi bi-check-lg"></i> : <i className="bi bi-share-fill"></i>}
                        <span className="d-none d-md-inline">{copiado ? "Copiado" : "Link"}</span>
                    </button>
                    
                    <button className="btn btn-danger btn-sm px-3" onClick={handleStopStream}>Finalizar</button>
                </div>
            </div>

            {/* Video Iframe (MODO HOST DE SALA) */}
            <div className="ratio ratio-16x9" style={{ borderRadius: "12px", overflow: "hidden", flexGrow: 1, border: `1px solid ${WHITE_BORDER}`, background: "#000", position: "relative" }}>
                <GiftOverlay />
                <iframe
                  // 🔥 CAMBIO: ?room=${claveStream}&push=Host para permitir invitados
                  src={`https://vdo.ninja/?room=${claveStream}&push=Host&webcam&microphone&autostart`}
                  allow="camera; microphone; autoplay; fullscreen"
                  frameBorder="0" width="100%" height="100%" title="Cámara"
                ></iframe>
            </div>
        </div>

        <div className="col-lg-3" style={{ height: "100%", position: "relative", borderLeft: `1px solid ${WHITE_BORDER}` }}>
            <div style={{ backgroundColor: "#1e1e1e", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "15px", borderBottom: "1px solid #333" }}>
                <h5 className="mb-0 fw-bold text-uppercase" style={{ fontSize: "0.9rem" }}>Chat en vivo</h5>
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