// src/Componentes/RegistroTransmision.tsx
import { useState, useEffect, useRef } from "react";


const RegistroTransmision: React.FC = () => {
  const [enTransmision, setEnTransmision] = useState(false);
  const [inicio, setInicio] = useState(null as number | null);
  const [horasTotales, setHorasTotales] = useState(0);
  const [elapsed, setElapsed] = useState(0); // segundos simulados (1s = 1 "hora" en la simulación)
  const [mensaje, setMensaje] = useState("");
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // cleanup al desmontar: evita intervalos colgados
  useEffect(() => {
    return () => {
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
      }
    };
  }, []);

  const iniciarTransmision = () => {
    if (enTransmision) return;
    setEnTransmision(true);
    setInicio(Date.now());
    setElapsed(0);
    setMensaje("🎬 Transmisión iniciada...");
    // simulamos 1 "hora" por segundo para testing
    intervaloRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  };

  const finalizarTransmision = () => {
    if (!enTransmision) return;

    // detener intervalo
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }

    const horasSimuladas = elapsed; // ya estamos usando 1s=1hora sim.
    setHorasTotales((prev) => prev + horasSimuladas);

    setEnTransmision(false);
    setInicio(null);
    setElapsed(0);
    const texto = `🛑 Transmisión finalizada. Se sumaron ${horasSimuladas} horas.`;
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 4000);
  };

  return (
    <div
      style={{
        backgroundColor: "#3f4142ff",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "25px",
        maxWidth: "420px",
        marginInline: "auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>🎥 Registro de Transmisión</h3>

      <p>
        Estado:{" "}
        <strong style={{ color: enTransmision ? "green" : "red" }}>
          {enTransmision ? "En vivo" : "Offline"}
        </strong>
      </p>

      <p>
        Horas acumuladas: <strong>{horasTotales}</strong>
      </p>

      <p>
        Horas sesión actual: <strong>{elapsed}</strong>
      </p>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: 8 }}>
        <button
          onClick={iniciarTransmision}
          disabled={enTransmision}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "8px 12px",
            border: "none",
            borderRadius: "8px",
            cursor: enTransmision ? "not-allowed" : "pointer",
          }}
        >
          Iniciar
        </button>

        <button
          onClick={finalizarTransmision}
          disabled={!enTransmision}
          style={{
            backgroundColor: "#f44336",
            color: "white",
            padding: "8px 12px",
            border: "none",
            borderRadius: "8px",
            cursor: !enTransmision ? "not-allowed" : "pointer",
          }}
        >
          Finalizar
        </button>
      </div>

      {mensaje && <p style={{ marginTop: 12 }}>{mensaje}</p>}
    </div>
  );
};

export default RegistroTransmision;
