import React, { useEffect, useState } from "react";
import Niveles from "./Niveles";

interface Mensaje {
  usuario: string;
  texto: string;
  nivel: number;
}

interface LiveChatProps {
  onMensajeEnviado?: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ onMensajeEnviado }) => {
  // --- ESTADO ---
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoTexto, setNuevoTexto] = useState<string>("");
  const [mostrarNiveles, setMostrarNiveles] = useState<boolean>(false);

  const [nivelUsuario, setNivelUsuario] = useState<number>(1);
  const [xpUsuario, setXpUsuario] = useState<number>(0);
  const [maxXP, setMaxXP] = useState<number>(50);

  // --- EFECTOS ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await fetch("http://localhost:4000/user/1");
        const data = await resp.json();
        
        if (data.user) {
            setNivelUsuario(data.user.nivel);
            setXpUsuario(data.user.mensajes_enviados);
            setMaxXP(data.user.nivel * 50 + 50);
        }
      } catch (error) {
        console.error("Error cargando usuario:", error);
      }
    };

    fetchUser();

    const mensajesIniciales: Mensaje[] = [
      { usuario: "@Hernán", texto: "Primero Aquí", nivel: 8 },
      { usuario: "@Eber", texto: "Aguante Radiohead", nivel: 12 },
      { usuario: "@Obi Wan", texto: "Hello There", nivel: 5 },
      { usuario: "@Andrea", texto: "¿Alguien ve Bluey?", nivel: 9 },
      { usuario: "@RosaMG", texto: "Holis", nivel: 14 },
      { usuario: "@aidex", texto: "Tiki Toko", nivel: 7 },
      { usuario: "@MarcoJRQ", texto: "No es mi culpa de que todo salga mal", nivel: 10 },
    ];
    setMensajes(mensajesIniciales);
  }, []);

  // --- HANDLERS ---
  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTexto.trim()) return;

    try {
      const userId = 1;
      const token = "ine";

      // 1. Petición al Backend
      const resp = await fetch(`http://localhost:4000/mensaje/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ texto: nuevoTexto }),
      });

      const data = await resp.json();

      const nuevoNivel = data.nivel || nivelUsuario;
      
      setNivelUsuario(nuevoNivel);
      setXpUsuario(data.mensajes_enviados || xpUsuario + 1);
      setMaxXP(data.maxXP || (nuevoNivel * 50 + 50));

      const nuevoMensaje: Mensaje = {
        usuario: "@Eber",
        texto: nuevoTexto.trim(),
        nivel: nuevoNivel,
      };

      setMensajes((prev) => [...prev, nuevoMensaje]);
      
      // ▼▼▼ AQUÍ ESTÁ LA MAGIA ▼▼▼
      setNuevoTexto(""); // Esto borra el texto del input
      // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

      if (data.subio_nivel) setMostrarNiveles(true);

      onMensajeEnviado?.();
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      
      {/* FONDO */}
      <iframe
        allow="fullscreen"
        frameBorder="0"
        width="100%"
        height="100%"
        style={{
          border: "none",
          borderRadius: "12px",
          backgroundColor: "#1e1e1e",
          pointerEvents: "none",
        }}
        title="ChatVDO"
      ></iframe>

      {/* MENSAJES */}
      <div
        id="chat-scroll"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          right: "10px",
          bottom: "80px",
          overflowY: "auto",
          paddingRight: "12px",
          zIndex: 10,
          pointerEvents: "auto",
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
              color: "#fff",
              fontSize: "14px",
            }}
          >
            <strong style={{ color: "#ff4d4d" }}>
              {msg.usuario}
              <span
                style={{
                  color: "#ccc",
                  fontSize: "0.85rem",
                  marginLeft: "6px",
                }}
              >
                • Nivel {msg.nivel}
              </span>
            </strong>
            : {msg.texto}
          </div>
        ))}
      </div>

      {/* INPUT Y BOTONES */}
      <form
        onSubmit={enviarMensaje}
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            value={nuevoTexto}
            onChange={(e) => setNuevoTexto(e.target.value)}
            placeholder="Escribe tu mensaje..."
            // He quitado el onClick que tenía error
            style={{
              padding: "8px",
              borderRadius: "6px",
              backgroundColor: "#222",
              color: "#fff",
              border: "none",
              width: "250px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              backgroundColor: "#ff4d4d",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Enviar
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMostrarNiveles(!mostrarNiveles)}
          style={{
            padding: "6px 12px",
            backgroundColor: "#2a2a2a",
            color: "#aaa",
            borderRadius: "6px",
            border: "1px solid #555",
            cursor: "pointer",
            fontSize: "0.9rem",
            alignSelf: "flex-start"
          }}
        >
          {mostrarNiveles ? "Ocultar niveles" : "Ver niveles"}
        </button>
      </form>

      {/* COMPONENTE NIVELES */}
      {mostrarNiveles && (
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "20px",
            zIndex: 50,
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <Niveles
            currentXP={xpUsuario}
            maxXP={maxXP}
            onClose={() => setMostrarNiveles(false)}
          />
        </div>
      )}
    </div>
  );
};

export default LiveChat;