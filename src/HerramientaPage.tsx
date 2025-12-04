import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
// Asegúrate de instalar: npm install chart.js
import Chart from 'chart.js/auto'; 

// Tus componentes (Mantenemos tus rutas originales)
import Sidebar from "./Componentes/SlideBar";
import RegistroTransmision from "./Componentes/RegistroTransmision";
import Header from "./Componentes/Header";
import useBloqueo from "../src/hooks/Bloqueo";

const RED = "#EE1D52";
const BACKEND_URL = "https://prograweb-tikitoko-backend-lw2q.onrender.com"; 

// Tipos para los datos del backend
interface UserStats {
    totalDurationSeconds: number;
    streamHistory: { createdAt: string }[];
}

const HerramientasPage = () => {
  const navigate = useNavigate();
  useBloqueo();

  // --- ESTADOS ---
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
  
  // Estado para las estadísticas reales del backend
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estado para la configuración de Puntos (Se mantiene tu lógica)
  const [puntosPorNivel, setPuntosPorNivel] = useState(1000);
  // const [puntosActuales] = useState(450); // Ya no es necesario si quitamos la barra de progreso visual

  // Referencias para el Gráfico
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // 1. CARGAR DATOS
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const profile = JSON.parse(stored);
      setUserProfile(profile);
      fetchStats(profile.id);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchStats = async (userId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/tools/stats/${userId}`);
      if (res.ok) {
        const data: UserStats = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error conectando al backend", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. RENDERIZAR GRÁFICO (Chart.js)
  useEffect(() => {
    if (stats && chartRef.current) {
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const dayCounts = [0, 0, 0, 0, 0, 0, 0];

      stats.streamHistory.forEach(stream => {
        const date = new Date(stream.createdAt);
        dayCounts[date.getDay()]++;
      });

      // Ordenar Lunes a Domingo
      const orderedLabels = [...dayNames.slice(1), dayNames[0]];
      const orderedData = [...dayCounts.slice(1), dayCounts[0]];

      if (chartInstance.current) chartInstance.current.destroy();

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: orderedLabels,
            datasets: [{
              label: 'Streams',
              data: orderedData,
              backgroundColor: orderedData.map(c => c > 0 ? RED : '#333'),
              borderRadius: 4,
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: '#333' }, ticks: { color: '#888', stepSize: 1 } },
              x: { grid: { display: false }, ticks: { color: '#888' } }
            }
          }
        });
      }
    }
  }, [stats]);

  // Utilidad: Formatear segundos a texto legible
  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return h > 0 ? `${h}h ${pad(m)}m ${pad(s)}s` : `${pad(m)}m ${pad(s)}s`;
  };

  const guardarConfig = () => {
    alert(`Configuración guardada: ${puntosPorNivel} puntos por nivel.`);
    // TODO: Aquí podrías hacer un fetch POST para guardar esto en el backend
  };

  if (isLoading) return <div className="bg-black min-vh-100 text-white p-5">Cargando...</div>;

  return (
    <div className="bg-black min-vh-100 text-white d-flex flex-column">
      {/* HEADER */}
      <Header
        showVentanaPerfil={showVentanaPerfil}
        setShowVentanaPerfil={setShowVentanaPerfil}
      />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="d-flex flex-grow-1">
        {/* SIDEBAR IZQUIERDA */}
        <Sidebar />

        {/* CONTENIDO CENTRAL */}
        <div className="p-4 border-bottom border-secondary flex-grow-1 overflow-auto">
          <h2
            className="fw-bold mb-4"
            style={{
              fontSize: "1.8rem",
              borderLeft: `4px solid ${RED}`,
              paddingLeft: "12px",
              letterSpacing: "0.5px",
            }}
          >
            Panel de Herramientas del Streamer
          </h2>

          {/* TARJETAS DE ESTADÍSTICAS */}
          <div className="row g-4">
            
            {/* TARJETA 1: HORAS TOTALES (Ahora con datos reales) */}
            <div className="col-md-4">
              <div className="bg-dark rounded-4 p-4 shadow-sm h-100 border border-secondary-subtle">
                <h6 className="text-secondary text-uppercase small mb-2">
                  Tiempo Total Transmitido
                </h6>
                <h3 className="text-light fw-bold display-6 mb-0">
                  {stats ? formatDuration(stats.totalDurationSeconds) : '0s'}
                </h3>
                <small className="text-secondary">
                    Acumulado de {stats?.streamHistory.length || 0} sesiones.
                </small>
              </div>
            </div>

            {/* TARJETA 2: CONFIGURACIÓN (Movida aquí para reemplazar la de progreso) */}
            <div className="col-md-8">
              <div className="bg-dark rounded-4 p-4 shadow-sm h-100 border border-secondary-subtle">
                <h6 className="text-secondary text-uppercase small mb-3">
                  Configuración de Gameificación
                </h6>
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <span className="fw-bold">XP para subir nivel:</span>
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
                  Ajusta qué tan difícil es para tus espectadores subir de nivel en tu canal.
                </small>
              </div>
            </div>

            {/* TARJETA 3: GRÁFICO (Nueva funcionalidad con tus estilos) */}
            <div className="col-md-12">
              <div className="bg-dark rounded-4 p-4 shadow-sm border border-secondary-subtle">
                <h6 className="text-secondary text-uppercase small mb-3">
                   Análisis de Actividad Semanal
                </h6>
                <p className="text-light small mb-3">
                    Días en los que más realizas transmisiones (basado en el historial).
                </p>
                {/* Contenedor del Canvas con altura controlada */}
                <div style={{ height: '300px', position: 'relative' }}>
                    <canvas ref={chartRef}></canvas>
                </div>
              </div>
            </div>
          </div>

          {/* COMPONENTE DE REGISTRO (Se mantiene igual) */}
          <div className="mt-5">
            <RegistroTransmision />
          </div>

          {/* ELIMINADO: CHAT DE ESPECTADORES */}
        </div>

        {/* PANEL DERECHO (Tus estilos originales preservados) */}
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
          <button className="menu-btn" onClick={() => navigate("/tools")}>
            <i className="bi bi-graph-up"></i> Ver Métricas
          </button>
          <button className="menu-btn" onClick={() => alert("Configurar niveles")}>
            <i className="bi bi-sliders"></i> Configurar Niveles
          </button>
          <button className="menu-btn" onClick={() => alert("Historial de streams")}>
            <i className="bi bi-clock-history"></i> Historial
          </button>

          <div className="menu-section">Información</div>
          <button className="menu-btn" onClick={() => navigate("/us")}>
            <i className="bi bi-person-circle"></i> Sobre Nosotros
          </button>
          <button className="menu-btn" onClick={() => navigate("/terms")}>
            <i className="bi bi-file-earmark-text"></i> Términos
          </button>
        </div>
      </div>
    </div>
  );
};

export default HerramientasPage;