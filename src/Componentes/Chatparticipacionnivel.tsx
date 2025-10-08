import React, { useState, useEffect } from "react";

const ChatParticipacionNivel = () => {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState<string[]>([]);
  const [puntos, setPuntos] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [notificacion, setNotificacion] = useState("");

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (mensaje.trim() === "") return;

    const nuevosPuntos = puntos + 1;
    setMensajes([...mensajes, mensaje]);
    setPuntos(nuevosPuntos);
    setMensaje("");
  };

  useEffect(() => {
    const nuevoNivel = Math.floor(puntos / 5) + 1;
    if (nuevoNivel > nivel) {
      setNivel(nuevoNivel);
      mostrarNotificacion(`🎉 ¡Subiste al Nivel ${nuevoNivel}! Sigue participando 🔥`);
    }
  }, [puntos]);

  const mostrarNotificacion = (texto: string) => {
    setNotificacion(texto);
    setTimeout(() => setNotificacion(""), 3000);
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        padding: "20px",
        marginTop: "25px",
        maxWidth: "400px",
        marginInline: "auto",
        position: "relative",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>💬 Chat de participación</h3>
      <p>
        Puntos: <strong>{puntos}</strong> | Nivel: <strong>{nivel}</strong>
      </p>

      {notificacion && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#00c851",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            animation: "pop 0.5s ease",
          }}
        >
          {notificacion}
        </div>
      )}

      <form
        onSubmit={enviarMensaje}
        style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
      >
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
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
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </form>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "10px",
          maxHeight: "200px",
          overflowY: "auto",
        }}
      >
        {mensajes.length === 0 ? (
          <p style={{ color: "#777" }}>Aún no hay mensajes...</p>
        ) : (
          mensajes.map((msg, i) => (
            <p key={i} style={{ marginBottom: "8px", textAlign: "left" }}>
              🧠 {msg}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatParticipacionNivel;
