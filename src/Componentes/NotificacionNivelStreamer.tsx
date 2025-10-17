import React, { useState, useEffect } from "react";

const NotificacionNivelStreamer = () => {
  const [horasTransmitidas, setHorasTransmitidas] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHorasTransmitidas((prev) => prev + 1);
    }, 5000); // ⏱️ simula una hora cada 5 segundos

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    if (horasTransmitidas > 0 && horasTransmitidas % 5 === 0) {
      const nuevoNivel = nivel + 1;
      setNivel(nuevoNivel);
      setMensaje(`🚀 ¡Subiste al nivel ${nuevoNivel}! 🎉`);
      setTimeout(() => setMensaje(""), 4000);
    }
  }, [horasTransmitidas]);

  return (
    <div
      style={{
        backgroundColor: "#fff8e1",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "25px",
        maxWidth: "400px",
        marginInline: "auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>⏰ Tiempo de transmisión</h3>
      <p>Horas transmitidas: <strong>{horasTransmitidas}</strong></p>
      <p>Nivel actual: <strong>{nivel}</strong></p>

      {mensaje && (
        <div
          style={{
            marginTop: "15px",
            backgroundColor: "#4caf50",
            color: "white",
            padding: "10px",
            borderRadius: "8px",
            animation: "pop 0.5s ease",
          }}
        >
          {mensaje}
        </div>
      )}
    </div>
  );
};

export default NotificacionNivelStreamer;
