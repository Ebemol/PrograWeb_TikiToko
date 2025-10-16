import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveTimer from "./Componentes/LiveTimer";
import GiftOverlay from "./Componentes/GiftOverlay";
import Chat from "./Componentes/Chat";

function StreamPage() {
  const navigate = useNavigate();

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [regaloActual, setRegaloActual] = useState("1 Rosa");
  const [espectadorActual, setEspectadorActual] = useState("@Hernán");

  const mostrarOverlay = () => {
    setOverlayVisible(true);
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

      {/* Overlay de regalo */}
      <GiftOverlay
        visible={overlayVisible}
        regalo={regaloActual}
        espectador={espectadorActual}
        onHide={() => setOverlayVisible(false)}
      />

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

              {/* Botón para gestionar regalos */}
              <div style={{ padding: "12px", borderTop: "1px solid #333", textAlign: "center" }}>
                <button
                  className="btn btn-danger"
                  onClick={() => navigate("/regalos")}
                > 
                Gestionar regalos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de prueba para simular regalo */}
        <div className="text-center mt-4">
          <button className="btn btn-danger" onClick={mostrarOverlay}>
            Simular regalo
          </button>
        </div>
      </div>
    </div>
  );
}

export default StreamPage;
