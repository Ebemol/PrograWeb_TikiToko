import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Componentes/SlideBar";
import RegistroTransmision from "./Componentes/RegistroTransmision";

const HerramientasPage = () => {
  const navigate = useNavigate();

  const [horasTotales] = useState(12);
  const [nivel] = useState(3);
  const [metaHoras] = useState(50);
  const [puntosPorNivel, setPuntosPorNivel] = useState(1000);
  const [puntosActuales] = useState(450);

  const progreso = Math.min((horasTotales / metaHoras) * 100, 100);
  const horasRestantes = Math.max(metaHoras - horasTotales, 0);

  const guardarConfig = () => {
    alert(`Configuración guardada: ${puntosPorNivel} puntos por nivel.`);
  };

  const espectadores = [
    { nombre: "María", nivel: 3, mensaje: "Excelente día para mirar stream" },
    { nombre: "Carlos", nivel: 5, mensaje: "¡Vamos por el siguiente nivel!" },
    { nombre: "Diana", nivel: 2, mensaje: "Primera vez viéndote 👋" },
    { nombre: "Anabel", nivel: 3, mensaje: "Excelente streamear, vamooooooos!!" },
    { nombre: "Jorge", nivel: 3, mensaje: "¡Vamos por el siguiente nivel!" },
    { nombre: "Dayana", nivel: 2, mensaje: "Vamos con todo hoy 👋" },
    { nombre: "Maripaz", nivel: 3, mensaje: "Excelente stream 😍" },
    { nombre: "Claudio", nivel: 4, mensaje: "¡Vamos por el siguiente nivel!" },
    { nombre: "Max", nivel: 6, mensaje: "Primera vez viéndote en vivo 👋" },
  ];

  return (
    <div className="bg-black min-vh-100 text-white d-flex">
      {/* SIDEBAR PRINCIPAL */}
      <Sidebar />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* NAVBAR SUPERIOR */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-secondary px-4 py-3 shadow-sm sticky-top">
          <div className="container-fluid">
            <button
              className="navbar-brand d-flex align-items-center"
              onClick={() => navigate("/feed")}
              style={{ border: "none", background: "transparent" }}
            >
              <img
                src="https://cdn.worldvectorlogo.com/logos/tiktok-banner-black-3.svg"
                alt="TikTok Banner"
                width="90"
                height="40"
              />
            </button>

            <div className="d-flex align-items-center ms-auto">
              <button
                className="btn d-flex align-items-center me-3"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "white",
                }}
                onClick={() => navigate("/shop")}
              >
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tiktok-round-white-icon.png"
                  alt="Monedas"
                  width="24"
                  height="24"
                  className="me-2"
                />
                <span className="fw-bold">120</span>
              </button>

              <button
                className="btn d-flex align-items-center"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "white",
                }}
              >
                <img
                  src="https://i.imgur.com/KcfC1AP.png"
                  alt="Perfil"
                  className="rounded-circle me-2"
                  width="40"
                  height="40"
                />
                <span className="fw-semibold">Progra</span>
              </button>
            </div>
          </div>
        </nav>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-4 border-bottom border-secondary flex-grow-1">
          <h2
            className="fw-bold mb-4"
            style={{
              fontSize: "1.8rem",
              borderLeft: "4px solid #EE1D52",
              paddingLeft: "12px",
              letterSpacing: "0.5px",
            }}
          >
            Panel de Herramientas del Streamer
          </h2>

          {/* TARJETAS DE ESTADÍSTICAS */}
          <div className="row g-4">
            <div className="col-md-4">
              <div className="bg-dark rounded-4 p-4 shadow-sm h-100 border border-secondary-subtle">
                <h6 className="text-secondary text-uppercase small mb-2">
                  Horas Totales Transmitidas
                </h6>
                <h3 className="text-light fw-bold display-6 mb-0">
                  {horasTotales} h
                </h3>
              </div>
            </div>

            <div className="col-md-8">
              <div className="bg-dark rounded-4 p-4 shadow-sm h-100 border border-secondary-subtle">
                <h6 className="text-secondary text-uppercase small mb-2">
                  Progreso al siguiente nivel
                </h6>
                <div className="progress mt-2 mb-2" style={{ height: "20px" }}>
                  <div
                    className="progress-bar bg-danger fw-semibold"
                    role="progressbar"
                    style={{ width: `${progreso}%` }}
                  >
                    {progreso.toFixed(0)}%
                  </div>
                </div>
                <small className="text-light">
                  Nivel actual: <strong>{nivel}</strong> — faltan{" "}
                  {horasRestantes} horas para el próximo nivel.
                </small>
              </div>
            </div>

            <div className="col-md-12">
              <div className="bg-dark rounded-4 p-4 shadow-sm border border-secondary-subtle">
                <h6 className="text-secondary text-uppercase small mb-3">
                  Configuración de puntos
                </h6>
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <input
                    type="number"
                    className="form-control bg-black text-white border-secondary"
                    style={{ width: "160px" }}
                    min={100}
                    value={puntosPorNivel}
                    onChange={(e) => setPuntosPorNivel(Number(e.target.value))}
                  />
                  <button
                    className="btn btn-outline-light px-4 fw-semibold"
                    onClick={guardarConfig}
                  >
                    Guardar
                  </button>
                </div>
                <small className="text-secondary mt-3 d-block">
                  Progreso actual: {puntosActuales}/{puntosPorNivel} puntos.
                </small>
              </div>
            </div>
          </div>

          {/* COMPONENTE DE REGISTRO */}
          <div className="mt-5">
            <RegistroTransmision />
          </div>

          {/* CHAT DE ESPECTADORES */}
          <div className="mt-5">
            <h4 className="fw-bold mb-3 text-light">
              Chat de Espectadores
            </h4>
            <div
              className="bg-dark p-3 rounded-4 shadow-sm border border-secondary-subtle text-white"
              style={{ maxHeight: "250px", overflowY: "auto" }}
            >
              {espectadores.map((e, i) => (
                <p key={i} className="mb-2">
                  <span className="text-danger fw-bold">[Lv {e.nivel}]</span>{" "}
                  <strong>{e.nombre}:</strong> {e.mensaje}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div
        className="bg-dark text-white border-start border-secondary shadow-sm"
        style={{ width: "260px", padding: "20px 15px", overflowY: "auto" }}
      >
        <style>
          {`
          .menu-btn {
            color: #ddd;
            background: transparent;
            border: none;
            display: flex;
            align-items: center;
            width: 100%;
            padding: 10px;
            gap: 10px;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-size: 0.9rem;
          }
          .menu-btn:hover {
            background-color: #EE1D52;
            color: white;
            transform: scale(1.03);
          }
          .menu-section {
            font-size: 0.75rem;
            color: #888;
            text-transform: uppercase;
            margin-top: 20px;
            margin-bottom: 5px;
          }
        `}
        </style>

        <div className="d-flex align-items-center mb-4">
          <i className="bi bi-gear-fill me-2 text-danger"></i>
          <h6 className="fw-bold mb-0">Herramientas</h6>
        </div>

        <div className="menu-section">Transmisión</div>
        <button className="menu-btn" onClick={() => navigate("/strem")}>
          <i className="bi bi-broadcast"></i> Emitir Live
        </button>
        <button className="menu-btn" onClick={() => navigate("/feed")}>
          <i className="bi bi-compass"></i> Descubrir Live
        </button>

        <div className="menu-section">Gestión</div>
        <button className="menu-btn" onClick={() => alert("Ver métricas")}>
          <i className="bi bi-graph-up"></i> Ver Métricas
        </button>
        <button className="menu-btn" onClick={() => alert("Configurar niveles")}>
          <i className="bi bi-sliders"></i> Configurar Niveles
        </button>
        <button className="menu-btn" onClick={() => alert("Historial de streams")}>
          <i className="bi bi-clock-history"></i> Historial
        </button>

        <div className="menu-section">Información</div>
        <button className="menu-btn" onClick={() => navigate("/about")}>
          <i className="bi bi-person-circle"></i> Sobre Nosotros
        </button>
        <button className="menu-btn" onClick={() => navigate("/terms")}>
          <i className="bi bi-file-earmark-text"></i> Términos
        </button>
      </div>
    </div>
  );
};

export default HerramientasPage;
