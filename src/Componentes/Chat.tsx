import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Niveles from "./Niveles"; // Asegúrate de importar tu componente Niveles

interface Mensaje {
  usuario: string;
  texto: string;
  nivel: number;
}

interface LiveChatProps {
  onMensajeEnviado?: () => void;
}

// Conexión única al socket fuera del componente para evitar reconexiones
const socket = io("http://127.0.0.1:5002");

const LiveChat: React.FC<LiveChatProps> = ({ onMensajeEnviado }) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoTexto, setNuevoTexto] = useState<string>("");
  
  // Estados de Gamificación
  const [nivelUsuario, setNivelUsuario] = useState<number>(1);
  const [xpUsuario, setXpUsuario] = useState<number>(0);
  const [maxXP, setMaxXP] = useState<number>(20);
  
  // Control de UI
  const [mostrarModalNivel, setMostrarModalNivel] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // --- 1. CARGA INICIAL Y SOCKET ---
  useEffect(() => {
    const inicializarChat = async () => {
        // A. Cargar datos del usuario desde LocalStorage o API
        const stored = localStorage.getItem("user");
        let userId = null;

        if (stored) {
            const user = JSON.parse(stored);
            setNivelUsuario(user.nivel || 1);
            setXpUsuario(user.mensajes_enviados || 0); // Asumiendo que XP = mensajes enviados
            setMaxXP(user.maxXP || 20);
            userId = user.id;
        }

        // B. Cargar Historial de Mensajes
        try {
            const resp = await fetch("http://127.0.0.1:5002/messages");
            if (resp.ok) {
                const historial = await resp.json();
                setMensajes(historial.length > 0 ? historial : [{ usuario: "Bot", texto: "¡Bienvenido!", nivel: 1 }]);
            }
        } catch (e) {
            console.error("Error cargando historial", e);
        }
    };

    inicializarChat();

    // Escuchar nuevos mensajes del socket
    socket.on("chat_message", (msg) => {
        setMensajes((prev) => [...prev, msg]);
    });

    return () => { socket.off("chat_message"); };
  }, []);

  // --- 2. ENVIAR MENSAJE (Conexión Backend) ---
  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTexto.trim()) return;

    try {
      const stored = localStorage.getItem("user");
      // Fallback si no hay usuario logueado
      const userLocal = stored ? JSON.parse(stored) : { id: 1, username: "Invitado" }; 

      // POST al Backend
      const resp = await fetch(`http://127.0.0.1:5002/mensaje/${userLocal.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": "Bearer TOKEN_REAL_AQUI" // Si usas JWT
        },
        body: JSON.stringify({ 
            texto: nuevoTexto,
            username: userLocal.username 
        }),
      });

      if (!resp.ok) throw new Error("Error en backend");

      const data = await resp.json();

      // ACTUALIZACIÓN DE ESTADO (MOTIVACIÓN)
      // El backend debe devolver: { nivel, mensajes_enviados, maxXP, subio_nivel }
      setNivelUsuario(data.nivel);
      setXpUsuario(data.mensajes_enviados); // o data.xp_actual
      setMaxXP(data.maxXP);
      setNuevoTexto("");

      // Actualizar LocalStorage para persistencia
      if (stored) {
          const userActualizado = { 
              ...userLocal, 
              nivel: data.nivel, 
              mensajes_enviados: data.mensajes_enviados,
              maxXP: data.maxXP
          };
          localStorage.setItem("user", JSON.stringify(userActualizado));
      }

      // Si subió de nivel, mostramos el Modal grande de celebración/info
      if (data.subio_nivel) {
          setMostrarModalNivel(true);
          // Opcional: auto-ocultar después de 5 segs
          // setTimeout(() => setMostrarModalNivel(false), 5000); 
      }

      onMensajeEnviado?.();
      
    } catch (err) {
      console.error("Fallo al enviar:", err);
    }
  };

  return (
    <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* --- INTEGRACIÓN DEL COMPONENTE NIVELES --- */}
      {mostrarModalNivel && (
        <div style={{
            position: "absolute",
            bottom: "70px", // Justo encima del input
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            animation: "slideUp 0.3s ease-out"
        }}>
            <Niveles 
                currentXP={xpUsuario} 
                maxXP={maxXP} 
                onClose={() => setMostrarModalNivel(false)}
            />
        </div>
      )}

      {/* ÁREA DE MENSAJES */}
      <div className="custom-scroll" style={{ flexGrow: 1, overflowY: "auto", padding: "10px", marginBottom: "10px" }}>
        {mensajes.map((msg, index) => (
          <div key={index} style={{ marginBottom: "8px", backgroundColor: "rgba(255,255,255,0.05)", padding: "8px 12px", borderRadius: "8px", color: "#fff", fontSize: "0.9rem" }}>
            <strong style={{ color: "#ff4d4d", marginRight: "6px" }}>
              {msg.usuario} 
              {/* Badge de Nivel en cada mensaje */}
              <span style={{ fontSize: "0.7rem", color: "#aaa", marginLeft: "6px", border: "1px solid #444", padding: "1px 4px", borderRadius: "4px" }}>
                Lvl {msg.nivel}
              </span>
            </strong>
            <span style={{ color: "#eee", display:"block", marginTop:"2px" }}>{msg.texto}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* BARRA DE PROGRESO "MINI" (Click para ver detalles) */}
      <div style={{ padding: "10px", backgroundColor: "#1e1e1e", borderTop: "1px solid #333" }}>
        
        <div 
            onClick={() => setMostrarModalNivel(!mostrarModalNivel)}
            style={{ cursor: "pointer", marginBottom: "10px" }}
            title="Ver mi progreso detallado"
        >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#aaa", marginBottom: "4px" }}>
                <span>Nivel {nivelUsuario}</span>
                <span>{xpUsuario}/{maxXP} XP</span>
            </div>
            {/* Barra visual simple */}
            <div style={{ width: "100%", height: "6px", backgroundColor: "#333", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ 
                    width: `${Math.min((xpUsuario / maxXP) * 100, 100)}%`, 
                    height: "100%", 
                    backgroundColor: "#EE1D52", 
                    transition: "width 0.3s ease" 
                }}></div>
            </div>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={enviarMensaje}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={nuevoTexto}
              onChange={(e) => setNuevoTexto(e.target.value)}
              placeholder="Escribe algo..."
              style={{
                flexGrow: 1, padding: "10px", borderRadius: "20px", backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444", outline: "none"
              }}
            />
            <button
              type="submit"
              disabled={!nuevoTexto.trim()}
              style={{
                padding: "8px 16px", borderRadius: "20px", backgroundColor: nuevoTexto.trim() ? "#EE1D52" : "#555", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", transition: "0.2s"
              }}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
          @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
    </div>
  );
};

export default LiveChat;