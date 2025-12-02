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

const socket = io("http://localhost:5002");

const LiveChat: React.FC<LiveChatProps> = ({ onMensajeEnviado }) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoTexto, setNuevoTexto] = useState<string>("");
  
  const [nivelUsuario, setNivelUsuario] = useState<number>(1);
  const [xpUsuario, setXpUsuario] = useState<number>(0);
  const [maxXP, setMaxXP] = useState<number>(20);
  
  const [mostrarModalNivel, setMostrarModalNivel] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // 1. CARGA INICIAL
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
            console.log("🔄 Cargando mensajes...");
            const resp = await fetch("http://localhost:5002/messages");
            if (resp.ok) {
                const historial = await resp.json();
                console.log("✅ Mensajes recibidos:", historial.length);
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

  // 2. ENVIAR MENSAJE
  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTexto.trim()) return;

    try {
      const stored = localStorage.getItem("user");
      const userLocal = stored ? JSON.parse(stored) : { id: 1, username: "Invitado" }; 

      const textoEnviado = nuevoTexto;
      setNuevoTexto("");

      const resp = await fetch(`http://localhost:5002/mensaje/${userLocal.id}`, {
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
      
      {/* Estilos CSS */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: #1e1e1e; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #555; border-radius: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #EE1D52; }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>

      {mostrarModalNivel && (
        <div style={{
            position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)",
            zIndex: 1000, animation: "slideUp 0.5s ease-out"
        }}>
            <Niveles onClose={() => setMostrarModalNivel(false)} />
        </div>
      )}

      {/* ÁREA DE MENSAJES */}
      <div 
        className="custom-scroll" 
        style={{ 
            flexGrow: 1, 
            overflowY: "auto", 
            padding: "10px", 
            marginBottom: "10px",
            minHeight: "0" // CLAVE PARA FLEXBOX
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
        <div ref={messagesEndRef} />
      </div>

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