import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Niveles from "./Niveles";

interface Mensaje {
  usuario: string;
  texto: string;
  nivel: number;
}

interface LiveChatProps {
  onMensajeEnviado?: () => void;
}

const socket = io("https://prograweb-tikitoko-backend-lw2q.onrender.com");

const LiveChat: React.FC<LiveChatProps> = ({ onMensajeEnviado }) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoTexto, setNuevoTexto] = useState<string>("");
  
  const [nivelUsuario, setNivelUsuario] = useState<number>(1);
  const [xpUsuario, setXpUsuario] = useState<number>(0);
  const [maxXP, setMaxXP] = useState<number>(20);
  
  const [mostrarModalNivel, setMostrarModalNivel] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  useEffect(() => {
    const inicializarChat = async () => {
        const stored = localStorage.getItem("user");
        if (stored) {
            const user = JSON.parse(stored);
            setNivelUsuario(user.nivel || 1);
            setXpUsuario(user.xp || 0); 
            setMaxXP((user.nivel || 1) * 10);
        }

        try {
            const resp = await fetch("https://prograweb-tikitoko-backend-lw2q.onrender.com/messages");
            if (resp.ok) {
                const historial = await resp.json();
                if (historial.length > 0) {
                    setMensajes(historial);
                } else {
                    setMensajes([{ usuario: "Bot", texto: "¡Bienvenido al chat!", nivel: 0 }]);
                }
            }
        } catch (e) {
            console.error("Error historial:", e);
        }
    };

    inicializarChat();

    socket.on("chat_message", (msg) => {
        setMensajes((prev) => [...prev, msg]);
    });

    return () => { socket.off("chat_message"); };
  }, []);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTexto.trim()) return;

    try {
      const stored = localStorage.getItem("user");
      const userLocal = stored ? JSON.parse(stored) : { id: 1, username: "Invitado" }; 

      const textoEnviado = nuevoTexto;
      setNuevoTexto("");

      const resp = await fetch(`https://prograweb-tikitoko-backend-lw2q.onrender.com/mensaje/${userLocal.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            texto: textoEnviado,
            username: userLocal.username 
        }),
      });

      if (!resp.ok) throw new Error("Error backend");
      const data = await resp.json();

      if (data.status === "success") {
          setNivelUsuario(data.nivel);
          setXpUsuario(data.mensajes_enviados);
          setMaxXP(data.maxXP);
          if (data.subio_nivel) setMostrarModalNivel(true);
          
          if (stored) {
              const u = JSON.parse(stored);
              u.nivel = data.nivel;
              u.xp = data.mensajes_enviados;
              localStorage.setItem("user", JSON.stringify(u));
          }
      }
      onMensajeEnviado?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* ESTILOS CSS INYECTADOS
          Aquí configuramos la barra para que sea visible y tenga color 
      */}
      <style>{`
        /* Animación */
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        
        /* SCROLLBAR PERSONALIZADA */
        /* Ancho de la barra */
        .custom-scroll::-webkit-scrollbar {
            width: 8px; 
        }
        
        /* Fondo de la barra (el carril) */
        .custom-scroll::-webkit-scrollbar-track {
            background: #121212; 
            border-radius: 4px;
        }
        
        /* La barra en sí (el pulgar) */
        .custom-scroll::-webkit-scrollbar-thumb {
            background: #444; 
            border-radius: 4px;
            border: 2px solid #121212; /* Espacio para que se vea flotante */
        }
        
        /* Color al pasar el mouse */
        .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: #EE1D52; 
        }
      `}</style>

      {mostrarModalNivel && (
        <div style={{
            position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)",
            zIndex: 1000, animation: "slideUp 0.5s ease-out"
        }}>
            <Niveles onClose={() => setMostrarModalNivel(false)} />
        </div>
      )}

      {/* ÁREA DE MENSAJES CON SCROLL */}
      <div 
        className="custom-scroll" 
        style={{ 
            flexGrow: 1, 
            overflowY: "auto", // Usa "scroll" si quieres ver el carril siempre, "auto" si solo cuando se llene
            padding: "10px", 
            marginBottom: "10px",
            // IMPORTANTE: height: 0 fuerza al flexbox a calcular el scroll correctamente
            height: "0px" 
        }}
      >
        {mensajes.map((msg, index) => (
          <div key={index} style={{ marginBottom: "8px", backgroundColor: "rgba(255,255,255,0.05)", padding: "8px 12px", borderRadius: "8px", color: "#fff", fontSize: "0.9rem" }}>
            <strong style={{ color: "#ff4d4d", marginRight: "6px" }}>
              {msg.usuario} 
              <span style={{ fontSize: "0.7rem", color: "#aaa", marginLeft: "6px", border: "1px solid #444", padding: "1px 4px", borderRadius: "4px" }}>
                Lvl {msg.nivel}
              </span>
            </strong>
            <span style={{ color: "#eee", display:"block", marginTop:"2px" }}>{msg.texto}</span>
          </div>
        ))}
        {/* Elemento invisible para auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* FOOTER */}
      <div style={{ padding: "10px", backgroundColor: "#1e1e1e", borderTop: "1px solid #333" }}>
        <div onClick={() => setMostrarModalNivel(true)} style={{ cursor: "pointer", marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#aaa", marginBottom: "4px" }}>
                <span>Nivel {nivelUsuario}</span>
                <span>{xpUsuario}/{maxXP} XP</span>
            </div>
            <div style={{ width: "100%", height: "6px", backgroundColor: "#333", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min((xpUsuario / maxXP) * 100, 100)}%`, height: "100%", backgroundColor: "#EE1D52", transition: "width 0.3s ease" }}></div>
            </div>
        </div>

        <form onSubmit={enviarMensaje}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={nuevoTexto}
              onChange={(e) => setNuevoTexto(e.target.value)}
              placeholder="Escribe algo..."
              style={{ flexGrow: 1, padding: "10px", borderRadius: "20px", backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444", outline: "none" }}
            />
            <button type="submit" disabled={!nuevoTexto.trim()} style={{ padding: "8px 16px", borderRadius: "20px", backgroundColor: nuevoTexto.trim() ? "#EE1D52" : "#555", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", transition: "0.2s" }}>
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LiveChat;