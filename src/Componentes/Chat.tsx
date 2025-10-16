import React, { useEffect, useState } from "react";

interface Mensaje {
  usuario: string;
  texto: string;
}

function LiveChat() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoTexto, setNuevoTexto] = useState<string>("");

  useEffect(() => {
    const mensajesIniciales: Mensaje[] = [
      { usuario: "@Hernán", texto: "Primero Aqui" },
      { usuario: "@Eber", texto: "Aguante Radiohead" },
      { usuario: "@Obi Wan", texto: "Hello There" },
      { usuario: "@Andrea", texto: "Alguien ve Bluey?" },
      { usuario: "@Mat_Trj", texto: "Prohibido las gordas" },
      { usuario: "@aidex", texto: "Tiki Toko" },
      { usuario: "@MarcoJRQ", texto: "No es mi culpa de que todo salga mal" }
    ];
    setMensajes(mensajesIniciales);
  }, []);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoTexto.trim() === "") return;

    const nuevoMensaje: Mensaje = {
      usuario: "@Eber",
      texto: nuevoTexto.trim(),
    };

    setMensajes((prev) => [...prev, nuevoMensaje]);
    setNuevoTexto("");
  };

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

      {/* Formulario para enviar mensaje */}
      <form
        onSubmit={enviarMensaje}
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          zIndex: 20,
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          value={nuevoTexto}
          onChange={(e) => setNuevoTexto(e.target.value)}
          placeholder="Escribe tu mensaje..."
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#222",
            color: "#fff",
            width: "250px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#ff4d4d",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default LiveChat;