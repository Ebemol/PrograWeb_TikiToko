import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SlideBar from "./Componentes/SlideBar";
import Header from "./Componentes/Header";
import useBloqueo from "../src/hooks/Bloqueo";

const Feed = () => {
  const navigate = useNavigate();
  useBloqueo();
  const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
  const [volume, setVolume] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cambiarVolumen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoVolumen = parseFloat(e.target.value);
    setVolume(nuevoVolumen);
    if (videoRef.current) {
      videoRef.current.volume = nuevoVolumen;
      videoRef.current.muted = nuevoVolumen === 0;
    }
  };

  return (
    <div className="bg-black min-vh-100 position-relative">
      <div className="d-flex">
        <SlideBar />

        <div className="flex-grow-1 d-flex flex-column">
          <Header
            showVentanaPerfil={showVentanaPerfil}
            setShowVentanaPerfil={setShowVentanaPerfil}
          />

          {/* Título */}
          <div className="px-4 pt-4 pb-3 border-bottom border-secondary">
            <h1
              className="text-white fw-bold mb-0"
              style={{
                fontSize: "2.2rem",
                letterSpacing: "0.5px",
                textShadow: "0 0 6px rgba(255,255,255,0.2)",
                borderLeft: "4px solid #EE1D52",
                paddingLeft: "12px",
              }}
            >
              Transmisión destacada
            </h1>
          </div>

          {/* Video principal */}
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-start px-4 pt-2">
            <div
              style={{
                position: "relative",
                maxWidth: "900px",
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: "#000",
              }}
            >
              {/* Indicador en vivo */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  backgroundColor: "#EE1D52",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  zIndex: 10,
                }}
              >
                🔴 EN VIVO
              </div>

              {/* Control de volumen */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={cambiarVolumen}
                style={{
                  position: "absolute",
                  bottom: "12px",
                  right: "12px",
                  width: "100px",
                  height: "6px",
                  borderRadius: "4px",
                  background: "#333",
                  outline: "none",
                  appearance: "none",
                  zIndex: 10,
                  accentColor: "#EE1D52",
                }}
              />

              {/* Video */}
              <video
                ref={videoRef}
                src="/Multimedia/Destacado.mp4"
                autoPlay
                muted={true}
                loop
                playsInline
                controls={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
              >
                Tu navegador no soporta el video.
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
