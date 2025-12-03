import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AuthRequired from "./Componentes/AuthRequired"; // <--- Importamos el bloqueo

// --- Constantes ---
const RED = "#EE1D52";
const WHITE_BORDER = "rgba(255, 255, 255, 0.15)";
const DEFAULT_AVATAR = "/user-default.png"; 

// Componente visual (Filas de configuración)
const SettingsRow: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="d-flex justify-content-between align-items-center py-3 border-bottom" style={{ borderColor: WHITE_BORDER }}>
    <div>
      <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>{title}</h3>
      <p style={{ color: "#cfcfcf", fontSize: 13, maxWidth: 350, marginBottom: 0 }}>
        {description}
      </p>
    </div>
    <div className="ms-4">{children}</div>
  </div>
);

const Configuracion: React.FC = () => {
  const navigate = useNavigate();

  // --- LÓGICA DE PROTECCIÓN (ANTI-BYPASS) ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    setLoadingAuth(false);
  }, []);
  // ------------------------------------------

  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- ESTADOS (Datos Reales) ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [theme] = useState("dark"); // Fijo en Dark

  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    newFollowers: true,
  });

  const [privacy, setPrivacy] = useState({
    privateAccount: false,
    showActivity: true,
    allowMessages: true,
  });

  // --- 1. CARGAR DATOS AL INICIAR ---
  useEffect(() => {
    const cargarDatos = async () => {
      const stored = localStorage.getItem("user");
      if (!stored) return;
      const uLocal = JSON.parse(stored);
      setUserId(uLocal.id);

      try {
        const res = await fetch(`https://prograweb-tikitoko-backend-1.onrender.com/user/${uLocal.id}`);
        const data = await res.json();
        
        if (data.user) {
          const u = data.user;
          setUsername(u.username || "");
          setEmail(u.email || "");
          setBio(u.bio || "");
          setProfilePicture(u.avatar || null);
          
          if (u.settings) {
            if (u.settings.notifications) setNotifications(prev => ({...prev, ...u.settings.notifications}));
            if (u.settings.privacy) setPrivacy(prev => ({...prev, ...u.settings.privacy}));
          }
        }
      } catch (error) {
        console.error("Error cargando:", error);
      }
    };
    if (isAuthorized) {
        cargarDatos();
    }
  }, [isAuthorized]);

  // --- 2. GUARDAR CAMBIOS ---
  const handleSave = async () => {
    if (!userId) return alert("Error: No estás logueado");
    setIsLoading(true);

    try {
      const res = await fetch("https://prograweb-tikitoko-backend-1.onrender.com/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          username,
          email,
          bio,
          avatar: profilePicture,
          theme,
          notifications,
          privacy
        })
      });

      if (res.ok) {
        alert("¡Cambios guardados con éxito!");
        const stored = localStorage.getItem("user");
        if(stored) {
            const parsed = JSON.parse(stored);
            parsed.username = username;
            localStorage.setItem("user", JSON.stringify(parsed));
        }
      } else {
        alert("Error al guardar.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. RESTABLECER ---
  const handleReset = () => {
    if(window.confirm("¿Recargar los datos originales?")) {
        window.location.reload();
    }
  };

  // --- 4. MANEJO DE FOTO ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) return alert("Imagen muy pesada (Máx 5MB)");

      const reader = new FileReader();
      reader.onload = (event) => setProfilePicture(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Helpers
  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const togglePriv = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- ESTILOS ---
  const inputStyle: React.CSSProperties = {
    background: "#0b0b0b",
    border: `1px solid ${WHITE_BORDER}`,
    color: "#fff",
    borderRadius: 10,
    padding: "10px 12px",
    letterSpacing: "0.2px",
    width: "100%",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 22,
    letterSpacing: "0.5px",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: `1px solid ${WHITE_BORDER}`,
  };

  // --- 1. ESTADO DE CARGA ---
  if (loadingAuth) {
    return <div className="min-vh-100" style={{ background: "#000" }}></div>;
  }

  // --- 2. ESTADO BLOQUEADO ---
  if (!isAuthorized) {
    return (
      <div className="min-vh-100 d-flex flex-column" style={{ background: "#000", color: "#fff" }}>
        {/* Header simple para volver */}
        <header
            className="d-flex align-items-center px-4 py-3 sticky-top"
            style={{ borderBottom: `1px solid ${WHITE_BORDER}`, background: "rgba(0,0,0,0.8)" }}
        >
            <button className="btn btn-link text-white p-0" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left fs-4" />
            </button>
            <h1 className="mb-0 fw-bold ms-3" style={{ fontSize: 18 }}>Configuración</h1>
        </header>
        
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <AuthRequired />
        </div>
      </div>
    );
  }

  // --- 3. CONTENIDO REAL ---
  return (
    <div
      className="min-vh-100"
      style={{
        background: "#000",
        color: "#f6f6f6",
        fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <header
        className="d-flex align-items-center justify-content-between px-4 py-3 sticky-top"
        style={{
          borderBottom: `1px solid ${WHITE_BORDER}`,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
      >
        <div className="d-flex align-items-center" style={{ gap: 16 }}>
          <button
            className="btn btn-link text-white p-0 d-flex align-items-center justify-content-center"
            onClick={() => navigate(-1)}
            aria-label="Volver"
            style={{ textDecoration: "none", width: 44, height: 44, borderRadius: 10 }}
          >
            <i className="bi bi-arrow-left fs-4" />
          </button>
          <h1 className="mb-0 fw-bold" style={{ fontSize: 18, letterSpacing: "0.6px", color: "#fff" }}>
            Configuración
          </h1>
        </div>
        <div className="d-flex align-items-center" style={{ gap: 10 }}>
          <button 
            className="btn btn-outline-secondary" 
            onClick={handleReset} 
            style={{ padding: "8px 14px", fontSize: 14, color: "#fff", borderRadius: 10 }}
          >
            Restablecer
          </button>
          <button 
            className="btn" 
            onClick={handleSave} 
            disabled={isLoading}
            style={{ padding: "8px 14px", fontSize: 14, color: "#fff", background: RED, border: `1px solid ${RED}`, borderRadius: 10, boxShadow: `0 8px 22px ${RED}33` }}
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </header>

      <main className="container-fluid d-flex justify-content-center py-5 px-3">
        <div className="w-100" style={{ maxWidth: 800 }}>
          
          {/* Perfil */}
          <div id="perfil-section" className="mb-5 p-4 rounded-4" style={{ background: "#0b0b0b", border: `1px solid ${WHITE_BORDER}` }}>
            <h2 style={sectionTitleStyle}>Perfil</h2>
            <div className="d-flex align-items-center mb-4">
              <img 
                src={profilePicture || DEFAULT_AVATAR} 
                alt="Foto de perfil" 
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} 
              />
              <div className="ms-4">
                <label className="btn btn-sm" style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                  Cambiar foto
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label text-white-50 small">Nombre de usuario</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label text-white-50 small">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} className="form-control" />
            </div>
            <div>
              <label className="form-label text-white-50 small">Biografía</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={{ ...inputStyle, minHeight: 100 }} className="form-control" rows={3}></textarea>
            </div>
          </div>

          {/* Notificaciones */}
          <div id="notificaciones-section" className="mb-5 p-4 rounded-4" style={{ background: "#0b0b0b", border: `1px solid ${WHITE_BORDER}` }}>
            <h2 style={sectionTitleStyle}>Notificaciones</h2>
            <SettingsRow title="Me gusta" description="Recibir notificaciones cuando a alguien le guste tu contenido.">
              <div className="form-check form-switch fs-5">
                <input className="form-check-input" type="checkbox" checked={notifications.likes} onChange={() => toggleNotif("likes")} />
              </div>
            </SettingsRow>
            <SettingsRow title="Comentarios" description="Recibir notificaciones cuando alguien comente en tus publicaciones.">
              <div className="form-check form-switch fs-5">
                <input className="form-check-input" type="checkbox" checked={notifications.comments} onChange={() => toggleNotif("comments")} />
              </div>
            </SettingsRow>
            <SettingsRow title="Nuevos seguidores" description="Recibir notificaciones cuando alguien comience a seguirte.">
              <div className="form-check form-switch fs-5">
                <input className="form-check-input" type="checkbox" checked={notifications.newFollowers} onChange={() => toggleNotif("newFollowers")} />
              </div>
            </SettingsRow>
          </div>

          {/* Privacidad */}
          <div id="privacidad-section" className="mb-5 p-4 rounded-4" style={{ background: "#0b0b0b", border: `1px solid ${WHITE_BORDER}` }}>
            <h2 style={sectionTitleStyle}>Privacidad</h2>
            <SettingsRow title="Cuenta privada" description="Solo la gente que apruebes podrá ver tus fotos y videos.">
              <div className="form-check form-switch fs-5">
                <input className="form-check-input" type="checkbox" checked={privacy.privateAccount} onChange={() => togglePriv("privateAccount")} />
              </div>
            </SettingsRow>
            <SettingsRow title="Mostrar estado de actividad" description="Permite que otros vean cuándo estuviste activo por última vez.">
              <div className="form-check form-switch fs-5">
                <input className="form-check-input" type="checkbox" checked={privacy.showActivity} onChange={() => togglePriv("showActivity")} />
              </div>
            </SettingsRow>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Configuracion;