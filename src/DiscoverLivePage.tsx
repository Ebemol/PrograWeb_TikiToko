import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveChat from "./Componentes/Chat";
import Niveles from "./Componentes/Niveles";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./Componentes/Header";

const DiscoverLivePage: React.FC = () => {
  const navigate = useNavigate();
  const [monedas, setMonedas] = useState(120);
  const [puntos, setPuntos] = useState(850);
  const [nivel, setNivel] = useState(12);
  const [mostrarNiveles, setMostrarNiveles] = useState(false);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
  const [mostrarRegalos, setMostrarRegalos] = useState(false);
  const [likes, setLikes] = useState(1234);
  const [hasLiked, setHasLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
    const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
  

  const maxXP = 1000;

  const regalos = [
    { nombre: "Rosa brillante", costo: 5, puntos: 10, emoji: "🌹" },
    { nombre: "Café virtual", costo: 8, puntos: 15, emoji: "☕" },
    { nombre: "Super sticker", costo: 12, puntos: 25, emoji: "⭐" },
    { nombre: "Confeti explosivo", costo: 20, puntos: 40, emoji: "🎉" },
    { nombre: "Corona dorada", costo: 35, puntos: 70, emoji: "👑" },
  ];

  const enviarRegalo = (costo: number, puntosGanados: number, nombre: string) => {
    if (monedas >= costo) {
      // Descontar monedas
      setMonedas(monedas - costo);
      
      // Sumar puntos
      let nuevoXP = puntos + puntosGanados;

      // Verificar subida de nivel (cuando XP >= maxXP)
      if (nuevoXP >= maxXP) {
        // Subir de nivel
        const nivelesSubidos = Math.floor(nuevoXP / maxXP);
        setNivel(nivel + nivelesSubidos);
        
        // Resetear XP con el excedente
        nuevoXP = nuevoXP % maxXP;
        
        // Mostrar notificación de subida
        setMostrarNotificacion(true);
        setTimeout(() => setMostrarNotificacion(false), 3000);
      }

      setPuntos(nuevoXP);

      // Limpiar error si había
      setMensajeError("");
      
      // Mostrar mensaje de éxito
      console.log(`✅ Regalo "${nombre}" enviado! -${costo} monedas, +${puntosGanados} puntos`);
    } else {
      // No tiene suficientes monedas
      setMensajeError(`No tienes suficientes monedas. Necesitas ${costo} monedas.`);
      setTimeout(() => setMensajeError(""), 3000);
    }
  };

  const registrarMensaje = async () => {
  try {
    const userId = 1;

    const response = await fetch(`http://localhost:4000/mensaje/${userId}`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer ine",
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error backend:", data);
      return;
    }

    setNivel(data.nivel);
    setPuntos(data.mensajes_enviados);

    if (data.subio_nivel) {
      setMostrarNotificacion(true);
      setTimeout(() => setMostrarNotificacion(false), 3000);
    }
  } catch (e) {
    console.error("Error al registrar mensaje", e);
  }
};


  const activarNotificacionManual = () => {
    setMostrarNotificacion(true);
    setTimeout(() => setMostrarNotificacion(false), 3000);
  };

  const handleLike = () => {
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    setHasLiked(!hasLiked);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
       <Header
        showVentanaPerfil={showVentanaPerfil}
        setShowVentanaPerfil={setShowVentanaPerfil}
      />
     
      <div className="container-fluid py-4">
        <div className="row" style={{ height: "calc(100vh - 160px)" }}>
          <div className="col-lg-9 mb-4" style={{ height: "100%" }}>
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <div
                className="ratio ratio-16x9"
                style={{ borderRadius: "12px", overflow: "hidden", flexGrow: 1 }}
              >
                <iframe
                  src="https://vdo.ninja/?view=ebemolStream01&scene&parent=localhost"
                  allow="autoplay; fullscreen"
                  frameBorder="0"
                  width="100%"
                  height="100%"
                  title="Ver Transmisión"
                ></iframe>
              </div>

              <div
                style={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: "12px",
                  padding: "20px",
                  marginTop: "15px",
                }}
              >
                <div className="d-flex align-items-start justify-content-between">
                  <div className="d-flex align-items-center">
                    <img
                      src="https://i.imgur.com/KcfC1AP.png"
                      alt="Streamer"
                      className="rounded-circle me-3"
                      width="60"
                      height="60"
                      style={{ objectFit: "cover" }}
                    />
                    <div>
                      <h4 className="mb-1 fw-bold">Ebemol</h4>
                      <p className="mb-0 text-light" style={{ fontSize: "14px" }}>
                        <span className="badge bg-danger me-2">🔴 EN VIVO</span>
                        <span>2.5K espectadores</span>
                      </p>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-light d-flex align-items-center gap-2"
                      onClick={handleLike}
                      style={{
                        backgroundColor: hasLiked ? "#EE1D52" : "transparent",
                        borderColor: hasLiked ? "#EE1D52" : "white",
                      }}
                    >
                      <i className={`bi bi-heart${hasLiked ? "-fill" : ""}`}></i>
                      <span>{likes}</span>
                    </button>
                    <button
                      className="btn d-flex align-items-center gap-2"
                      onClick={handleFollow}
                      style={{
                        backgroundColor: isFollowing ? "#555" : "#EE1D52",
                        color: "white",
                        border: "none",
                      }}
                    >
                      {isFollowing ? "Siguiendo" : "Seguir"}
                    </button>
                    <button className="btn btn-outline-light">
                      <i className="bi bi-share"></i>
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <h5 className="fw-semibold">🎮 Programando en React - Creando TikiToko</h5>
                  <p className="text-light mb-0" style={{ fontSize: "14px" }}>
                    Desarrollo web en vivo | React + TypeScript | Preguntas y respuestas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3" style={{ height: "100%", position: "relative" }}>
            {mostrarNotificacion && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  boxShadow: "0 0 12px rgba(0,0,0,0.5)",
                  zIndex: 999,
                  animation: "fadeInOut 3s ease-in-out",
                }}
              >
                🎉 ¡Subiste al nivel {nivel}!
              </div>
            )}

            {mensajeError && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  boxShadow: "0 0 12px rgba(0,0,0,0.5)",
                  zIndex: 999,
                  animation: "fadeInOut 3s ease-in-out",
                }}
              >
                ⚠️ {mensajeError}
              </div>
            )}

            <div
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "12px",
                padding: "0",
                height: "100%",
                overflow: "hidden",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ padding: "10px", borderBottom: "1px solid #333" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Chat en vivo</h5>
                  <button
                    onClick={() => setMostrarRegalos(!mostrarRegalos)}
                    style={{
                      backgroundColor: "#333",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "1.2rem",
                    }}
                  >
                    🎁
                  </button>
                </div>
              </div>

              <div style={{ flexGrow: 1 }}>
                <LiveChat onMensajeEnviado={registrarMensaje} />
              </div>

              <div style={{ padding: "10px", borderTop: "1px solid #333" }}>
             
              </div>
            </div>

            {mostrarRegalos && (
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  right: "0",
                  width: "280px",
                  backgroundColor: "#1e1e1e",
                  borderRadius: "12px",
                  padding: "15px",
                  boxShadow: "0 0 15px rgba(0,0,0,0.5)",
                  zIndex: 1000,
                }}
              >
                <h6 className="mb-3 text-center fw-bold">🎁 Enviar regalo</h6>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {regalos.map((regalo, index) => (
                    <li
                      key={index}
                      style={{
                        backgroundColor: "#2a2a2a",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>{regalo.emoji} {regalo.nombre}</strong>
                        <div style={{ fontSize: "0.85rem", color: "#ccc" }}>
                          Costo: {regalo.costo} monedas • {regalo.puntos} pts
                        </div>
                      </div>
                      <button
                        onClick={() => enviarRegalo(regalo.costo, regalo.puntos, regalo.nombre)}
                        style={{
                          backgroundColor: "#ff4d4d",
                          border: "none",
                          borderRadius: "6px",
                          padding: "6px 10px",
                          color: "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                        }}
                      >
                        Enviar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {mostrarNiveles && (
        <Niveles
          currentXP={puntos}
          maxXP={maxXP}
          onClose={() => setMostrarNiveles(false)}
        />
      )}

      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
};

export default DiscoverLivePage;