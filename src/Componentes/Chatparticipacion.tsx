import React, { useState } from "react";

const ChatParticipacion = () => {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState<string[]>([]);
  const [puntos, setPuntos] = useState(0);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (mensaje.trim() === "") return;

    setMensajes([...mensajes, mensaje]);
    setPuntos(puntos + 1);
    setMensaje("");
  };

  return (
    <div style={{
      backgroundColor: "#f5f5f5",
      borderRadius: "12px",
      padding: "20px",
      marginTop: "25px",
      maxWidth: "400px",
      marginInline: "auto"
    }}>
      <h3 style={{ marginBottom: "15px" }}>💬 Chat de participación</h3>
      <p>Puntos por participación: <strong>{puntos}</strong></p>

      <form onSubmit={enviarMensaje} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer"
          }}
        >
          Enviar
        </button>
      </form>

      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "10px",
        maxHeight: "200px",
        overflowY: "auto"
      }}>
        {mensajes.length === 0 ? (
          <p style={{ color: "#777" }}>Aún no hay mensajes...</p>
        ) : (
          mensajes.map((msg, i) => (
            <p key={i} style={{ marginBottom: "8px", textAlign: "left" }}>🧠 {msg}</p>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatParticipacion;
