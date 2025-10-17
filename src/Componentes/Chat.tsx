import React, { useEffect, useState } from "react";

interface Mensaje {
  usuario: string;
  texto: string;
  nivel: number;
}

interface LiveChatProps {
  onMensajeEnviado?: () => void;
}

function LiveChat({ onMensajeEnviado }: LiveChatProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoTexto, setNuevoTexto] = useState<string>("");
  const [mostrarRegalos, setMostrarRegalos] = useState(false);


  useEffect(() => {
    const mensajesIniciales: Mensaje[] = [
    { usuario: "@Hernán", texto: "Primero Aqui", nivel: 8 },
    { usuario: "@Eber", texto: "Aguante Radiohead", nivel: 12 },
    { usuario: "@Obi Wan", texto: "Hello There", nivel: 5 },
    { usuario: "@Andrea", texto: "Alguien ve Bluey?", nivel: 9 },
    { usuario: "@RosaMG", texto: "Holis", nivel: 14 },
    { usuario: "@aidex", texto: "Tiki Toko", nivel: 7 },
    { usuario: "@MarcoJRQ", texto: "No es mi culpa de que todo salga mal", nivel: 10 }
  ];
    setMensajes(mensajesIniciales);
  }, []);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoTexto.trim() === "") return;

    const nuevoMensaje: Mensaje = {
  usuario: "@Eber",
  texto: nuevoTexto.trim(),
  nivel: 1 
};


    setMensajes((prev) => [...prev, nuevoMensaje]);
    setNuevoTexto("");

    if (onMensajeEnviado) {
      onMensajeEnviado();
    }
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
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
            <strong style={{ color: "#ff4d4d" }}>
  {msg.usuario}
  <span style={{ color: "#ccc", fontSize: "0.85rem", marginLeft: "6px" }}>
    • Nivel {msg.nivel}
  </span>
</strong>: {msg.texto}

          </div>
        ))}
      </div>

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
