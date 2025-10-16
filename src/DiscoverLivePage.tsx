import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveChat from "./Componentes/Chat";

const DiscoverLivePage: React.FC = () => {
  const navigate = useNavigate();
  const [puntos, setPuntos] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [mostrarNotificacion, setMostrarNotificacion] = useState(false);
  const [mostrarRegalos, setMostrarRegalos] = useState(false);

  const regalos = [
    { nombre: "Rosa brillante", costo: "S/5.00", puntos: 10 },
    { nombre: "Café virtual", costo: "S/8.00", puntos: 15 },
    { nombre: "Super sticker", costo: "S/12.00", puntos: 25 },
    { nombre: "Confeti explosivo", costo: "S/20.00", puntos: 40 },
    { nombre: "Corona dorada", costo: "S/35.00", puntos: 70 },
  ];

  const sumarPunto = () => {
    const nuevoXP = puntos + 1;
    setPuntos(nuevoXP);

    const nuevoNivel = Math.floor(nuevoXP / 10) + 1;
    if (nuevoNivel > nivel) {
      setNivel(nuevoNivel);
      setMostrarNotificacion(true);
      setTimeout(() => setMostrarNotificacion(false), 3000);
    }
  };

  const activarNotificacionManual = () => {
    setMostrarNotificacion(true);
    setTimeout(() => setMostrarNotificacion(false), 3000);
  };

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      {/* Barra superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2 py-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <button
            className="navbar-brand d-flex align-items-center"
            onClick={() => navigate("/feed")}
            style={{ paddingLeft: "40px", border: "none", background: "transparent" }}
          >
            <img
              src="https://cdn.worldvectorlogo.com/logos/tiktok-banner-black-3.svg"
              alt="TikTok Banner"
              width="90"
              height="40"
              className="d-inline-block align-text-top"
            />
          </button>

          {/* Puntos por participación */}
          <div className="text-white fw-bold">
            Participación: {puntos} pts
          </div>
        </div>
      </nav>

      {/* Layout principal */}
      <div className="container-fluid py-4">
        <div className="row" style={{ height: "calc(100vh - 160px)" }}>
          {/* Video */}
          <div className="col-lg-9 mb-4" style={{ height: "100%" }}>
            <div
              className="ratio ratio-16x9"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                height: "100%",
                backgroundColor: "#000",
              }}
            >
              <video
                src="/Multimedia/videoplayback.mp4"
                controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Chat + regalos + notificación */}
          <div className="col-lg-3" style={{ height: "100%", position: "relative" }}>
            {/* Notificación de nivel */}
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
                <LiveChat onMensajeEnviado={sumarPunto} />
              </div>

              {/* Botón para probar notificación */}
              <div style={{ padding: "10px", borderTop: "1px solid #333" }}>
                <button
                  onClick={activarNotificacionManual}
                  className="btn btn-outline-light w-100"
                >
                  Probar subida de nivel
                </button>
              </div>
            </div>

            {/* Ventana flotante de regalos */}
            {mostrarRegalos && (
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  right: "0",
                  width: "280px",
                  backgroundColor: "#1e1e1e",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                  zIndex: 30,
                  color: "white",
                }}
              >
                <h5 className="mb-3">Regalos disponibles</h5>
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
                        <strong>{regalo.nombre}</strong>
                        <div style={{ fontSize: "0.85rem", color: "#ccc" }}>
                          Costo: {regalo.costo} • {regalo.puntos} pts
                        </div>
                      </div>
                      <button
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

      {/* Animación CSS */}
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
