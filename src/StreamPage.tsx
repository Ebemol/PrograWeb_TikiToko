import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveTimer from "./Componentes/LiveTimer";
import Chat from "./Componentes/Chat";

function StreamPage() {
  const navigate = useNavigate();

  const [regaloActual, setRegaloActual] = useState("1 Rosa");
  const [espectadorActual, setEspectadorActual] = useState("@Hernán");

  const nivelStreamer = 2; // fijo, visual
  const [mostrarNotiNivel, setMostrarNotiNivel] = useState(false);
  const [mostrarNotiRegalo, setMostrarNotiRegalo] = useState(false);

  const mostrarOverlay = () => {
    setMostrarNotiRegalo(true);
    setTimeout(() => setMostrarNotiRegalo(false), 3000);
  };

  const activarNotificacionNivel = () => {
    setMostrarNotiNivel(true);
    setTimeout(() => setMostrarNotiNivel(false), 3000);
  };

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white", position: "relative" }}>
      {/* Header */}
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

          {/* Contador visual */}
          <LiveTimer />
        </div>
      </nav>

      {/* Notificaciones flotantes */}
      <div style={{ position: "absolute", top: "80px", right: "20px", zIndex: 999 }}>
        {mostrarNotiNivel && (
          <div
            style={{
              backgroundColor: "#ff4d4d",
              color: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 0 12px rgba(0,0,0,0.5)",
              marginBottom: "10px",
              animation: "fadeInOut 3s ease-in-out",
            }}
          >
            🚀 ¡Estás en el nivel {nivelStreamer} como streamer!
          </div>
        )}
        {mostrarNotiRegalo && (
          <div
            style={{
              backgroundColor: "#ff4d4d",
              color: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              boxShadow: "0 0 12px rgba(0,0,0,0.5)",
              animation: "fadeInOut 3s ease-in-out",
            }}
          >
            🎁 ¡Recibiste un regalo de {espectadorActual}!
          </div>
        )}
      </div>

      {/* Stream + Chat layout */}
      <div className="container-fluid py-4">
        <div className="row" style={{ height: "calc(100vh - 160px)" }}>
          {/* Stream principal */}
          <div className="col-lg-9 mb-4" style={{ height: "100%" }}>
            <div className="ratio ratio-16x9" style={{ borderRadius: "12px", overflow: "hidden", height: "100%" }}>
              <iframe
                src="https://vdo.ninja/?push=ebemolStream01&webcam&microphone&parent=localhost"
                allow="camera; microphone"
                frameBorder="0"
                width="100%"
                height="100%"
                title="Transmisión Ebemol"
              ></iframe>
            </div>
          </div>

          {/* Chat lateral usando componente */}
          <div className="col-lg-3" style={{ height: "100%" }}>
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
                <h5 className="mb-0">Chat en vivo</h5>
              </div>

              <div style={{ flexGrow: 1 }}>
                <Chat />
              </div>

              {/* Botones debajo del chat */}
              <div style={{ padding: "10px", borderTop: "1px solid #333" }}>
                <button
                  onClick={mostrarOverlay}
                  className="btn btn-outline-light w-100 mb-2"
                >
                  Simular regalo
                </button>
                <button
                  onClick={activarNotificacionNivel}
                  className="btn btn-outline-light w-100"
                >
                  Simular subida de nivel
                </button>
              </div>
            </div>
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
}

export default StreamPage;
