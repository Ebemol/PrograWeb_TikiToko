import React, { useEffect, useState } from "react";

interface Mensaje {
  usuario: string;
  texto: string;
}

function LiveChat() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);

  useEffect(() => {
    // Mensajes simulados al cargar
    const mensajesIniciales: Mensaje[] = [
      { usuario: "@Hernán", texto: "Primero Aqui" },
      { usuario: "@Eber", texto: "Aguante Radiohead" },
      { usuario: "@Obi Wan", texto: "Hello There" },
      { usuario: "@Andrea", texto: "Alguien ve Bluey?" },
      { usuario: "@Mat_Trj", texto: "Prohibido las gordas" },
    ];
    setMensajes(mensajesIniciales);
  }, []);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Chat embebido */}
      <iframe
        allow="fullscreen"
        frameBorder="0"
        width="100%"
        height="100%"
        style={{
          border: "none",
          borderRadius: "12px",
          backgroundColor: "#1e1e1e",
        }}
        title="Chat VDO.Ninja"
      ></iframe>

      {/* Overlay de mensajes simulados */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 10,
          color: "#fff",
          fontSize: "14px",
          pointerEvents: "none",
        }}
      >
        {mensajes.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "6px",
              backgroundColor: "#333",
              padding: "6px 10px",
              borderRadius: "8px",
              boxShadow: "0 0 4px rgba(0,0,0,0.4)",
            }}
          >
            <strong style={{ color: "#ff4d4d" }}>{msg.usuario}</strong>: {msg.texto}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveChat;