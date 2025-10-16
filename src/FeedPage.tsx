import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SlideBar from './Componentes/SlideBar';
import MiniVentanaPerfil from './Componentes/Niveles';

const Feed = () => {
  const navigate = useNavigate();
  const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
  const [volume, setVolume] = useState(0); // inicia apagado
  const perfilRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOutsideClick = (e: MouseEvent) => {
    if (perfilRef.current && !perfilRef.current.contains(e.target as Node)) {
      setShowVentanaPerfil(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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
          {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2 py-3">
            <div className="container-fluid">
              {/* Logo */}
              <button
                className="navbar-brand d-flex align-items-center"
                onClick={() => navigate('/feed')}
                style={{ paddingLeft: '40px', border: 'none', background: 'transparent' }}
              >
                <img
                  src="https://cdn.worldvectorlogo.com/logos/tiktok-banner-black-3.svg"
                  alt="TikTok Banner"
                  width="90"
                  height="40"
                  className="d-inline-block align-text-top"
                />
              </button>

              {/* Usuario y monedas */}
              <div className="d-flex align-items-center ms-auto position-relative" ref={perfilRef}>
                <button
                  className="btn d-flex align-items-center me-3 btn-monedas"
                  style={{ border: 'none', background: 'transparent', color: 'white' }}
                  onClick={() => navigate('/shop')}
                >
                  <img
                    src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tiktok-round-white-icon.png"
                    alt="Monedas"
                    width="24"
                    height="24"
                    className="me-1 icono-monedas"
                  />
                  <span className="fw-bold texto-monedas">120</span>
                </button>

                <button
                  className="btn d-flex align-items-center btn-perfil"
                  style={{ border: 'none', background: 'transparent', color: 'white' }}
                  onClick={() => setShowVentanaPerfil(prev => !prev)}
                >
                  <img
                    src="https://i.imgur.com/KcfC1AP.png"
                    alt="Perfil"
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                  />
                  <span className="fw-semibold texto-usuario">Progra</span>
                </button>

                {showVentanaPerfil && (
                  <MiniVentanaPerfil
                    currentXP={429}
                    maxXP={1337}
                    onClose={() => setShowVentanaPerfil(false)}
                  />
                )}
              </div>
            </div>
          </nav>

          {/* Contenido */}
          <div className="px-4 pt-4 pb-3 border-bottom border-secondary">
            <h1
              className="text-white fw-bold mb-0"
              style={{
                fontSize: '2.2rem',
                letterSpacing: '0.5px',
                textShadow: '0 0 6px rgba(255,255,255,0.2)',
                borderLeft: '4px solid #EE1D52',
                paddingLeft: '12px',
              }}
            >
              Transmisión destacada
            </h1>
          </div>

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
              {/* Etiqueta EN VIVO */}
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

              {/* Slider de volumen estético */}
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

              {/* Video local */}
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

      {/* Estilos */}
      <style>
        {`
          .btn-monedas:hover .icono-monedas {
            filter: brightness(0) saturate(100%) invert(23%) sepia(93%) saturate(748%) hue-rotate(330deg) brightness(95%) contrast(101%);
          }

          .btn-monedas:hover .texto-monedas {
            color: #EE1D52;
          }

          .btn-perfil:hover .texto-usuario {
            color: #EE1D52;
          }
        `}
      </style>
    </div>
  );
};

export default Feed;