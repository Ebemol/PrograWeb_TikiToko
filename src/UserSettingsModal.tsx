import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// --- Constantes y Helpers ---
const RED = "#EE1D52";

// Componente reutilizable para las filas de configuración
const SettingsRow: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="d-flex justify-content-between align-items-center py-3 border-bottom" style={{ borderColor: "rgba(238,29,82,0.08)" }}>
    <div>
      <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>{title}</h3>
      <p style={{ color: "#cfcfcf", fontSize: 13, maxWidth: 350, marginBottom: 0 }}>
        {description}
      </p>
    </div>
    <div className="ms-4">{children}</div>
  </div>
);

// --- Componente Principal ---
const Configuracion: React.FC = () => {
  const navigate = useNavigate();

  // --- Estado ---
  const initialData = {
    username: "Progra",
    email: "progra@ejemplo.com",
    bio: "Apasionado por el código y el café. Compartiendo tips de programación y tecnología.",
    profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    theme: "dark",
    notifications: {
      likes: true,
      comments: true,
      newFollowers: true,
    },
    privacy: {
      privateAccount: false,
      showActivity: true,
      allowMessages: true,
      tagApproval: true,
      storyVisibility: "followers",
      blockedUsersCount: 0,
      twoFactorAuth: false,
      dataDownloadRequested: false,
    },
  };

  const [username, setUsername] = useState(initialData.username);
  const [email, setEmail] = useState(initialData.email);
  const [bio, setBio] = useState(initialData.bio);
  const [profilePicture, setProfilePicture] = useState<string | null>(initialData.profilePicture);
  const [theme, setTheme] = useState(initialData.theme);
  const [notifications, setNotifications] = useState(initialData.notifications);
  const [privacy, setPrivacy] = useState(initialData.privacy);

  // --- Handlers ---
  const handleSave = () => {
    console.log("Configuración guardada:", { username, email, bio, theme, notifications, privacy });
    alert("Cambios guardados");
  };

  const handleReset = () => {
    setUsername(initialData.username);
    setEmail(initialData.email);
    setBio(initialData.bio);
    setProfilePicture(initialData.profilePicture);
    setTheme(initialData.theme);
    setNotifications(initialData.notifications);
    setPrivacy(initialData.privacy);
    alert("Configuración restablecida.");
  };

  const handleStateChange = (setState: Function, key: string, value: any) => {
    setState((prev: any) => ({ ...prev, [key]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // --- Estilos ---
  const inputStyle: React.CSSProperties = {
    background: "#0b0b0b",
    border: `1px solid rgba(238,29,82,0.12)`,
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
    borderBottom: `1px solid rgba(238,29,82,0.12)`,
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "#000",
        color: "#f6f6f6",
        fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      {/* Header */}
      <header
        className="d-flex align-items-center justify-content-between px-4 py-3 sticky-top"
        style={{
          borderBottom: `1px solid rgba(238,29,82,0.12)`,
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
          <button className="btn btn-outline-secondary" onClick={handleReset} style={{ padding: "8px 14px", fontSize: 14, color: "#fff", borderRadius: 10 }}>
            Restablecer
          </button>
          <button className="btn" onClick={handleSave} style={{ padding: "8px 14px", fontSize: 14, color: "#fff", background: RED, border: `1px solid ${RED}`, borderRadius: 10, boxShadow: `0 8px 22px ${RED}33` }}>
            Guardar Cambios
          </button>
        </div>
      </header>

      {/* Main Content - Una Sola Página */}
      <main className="container-fluid d-flex justify-content-center py-5 px-3">
        <div className="w-100" style={{ maxWidth: 800 }}>
          
          {/* Sección Perfil */}
          <div id="perfil-section" className="mb-5 p-4 rounded-4" style={{ background: "#0b0b0b", border: `1px solid rgba(238,29,82,0.06)` }}>
            <h2 style={sectionTitleStyle}>Perfil</h2>
            <div className="d-flex align-items-center mb-4">
              <img src={profilePicture || 'https://i.pravatar.cc/150'} alt="Foto de perfil" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }} />
              <div className="ms-4">
                <label htmlFor="file-upload" className="btn btn-sm" style={{ color: '#fff', border: '1px solid #fff3', cursor: 'pointer' }}>
                  Cambiar foto
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
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

          {/* Sección Apariencia */}
          <div id="apariencia-section" className="mb-5 p-4 rounded-4" style={{ background: "#0b0b0b", border: `1px solid rgba(238,29,82,0.06)` }}>
            <h2 style={sectionTitleStyle}>Apariencia</h2>
            <SettingsRow title="Tema de la aplicación" description="Elige cómo quieres que se vea la interfaz.">
              <div className="btn-group">
                <button className={`btn btn-sm ${theme === 'dark' ? 'btn-danger' : 'btn-outline-secondary'}`} onClick={() => setTheme('dark')}>Oscuro</button>
                <button className={`btn btn-sm ${theme === 'light' ? 'btn-danger' : 'btn-outline-secondary'}`} onClick={() => setTheme('light')}>Claro</button>
              </div>
            </SettingsRow>
          </div>

          {/* Sección Notificaciones */}
          <div id="notificaciones-section" className="mb-5 p-4 rounded-4" style={{ background: "#0b0b0b", border: `1px solid rgba(238,29,82,0.06)` }}>
            <h2 style={sectionTitleStyle}>Notificaciones</h2>
            <SettingsRow title="Me gusta" description="Recibir notificaciones cuando a alguien le guste tu contenido.">
              <div className="form-check form-switch fs-5"><input className="form-check-input" type="checkbox" checked={notifications.likes} onChange={(e) => handleStateChange(setNotifications, "likes", e.target.checked)} /></div>
            </SettingsRow>
            <SettingsRow title="Comentarios" description="Recibir notificaciones cuando alguien comente en tus publicaciones.">
              <div className="form-check form-switch fs-5"><input className="form-check-input" type="checkbox" checked={notifications.comments} onChange={(e) => handleStateChange(setNotifications, "comments", e.target.checked)} /></div>
            </SettingsRow>
            <SettingsRow title="Nuevos seguidores" description="Recibir notificaciones cuando alguien comience a seguirte.">
              <div className="form-check form-switch fs-5"><input className="form-check-input" type="checkbox" checked={notifications.newFollowers} onChange={(e) => handleStateChange(setNotifications, "newFollowers", e.target.checked)} /></div>
            </SettingsRow>
          </div>

          {/* Sección Privacidad */}
          <div id="privacidad-section" className="mb-5 p-4 rounded-4" style={{ background: "#0b0b0b", border: `1px solid rgba(238,29,82,0.06)` }}>
            <h2 style={sectionTitleStyle}>Privacidad</h2>
            <SettingsRow title="Cuenta privada" description="Solo la gente que apruebes podrá ver tus fotos y videos.">
              <div className="form-check form-switch fs-5"><input className="form-check-input" type="checkbox" checked={privacy.privateAccount} onChange={(e) => handleStateChange(setPrivacy, "privateAccount", e.target.checked)} /></div>
            </SettingsRow>
            <SettingsRow title="Mostrar estado de actividad" description="Permite que otros vean cuándo estuviste activo por última vez.">
              <div className="form-check form-switch fs-5"><input className="form-check-input" type="checkbox" checked={privacy.showActivity} onChange={(e) => handleStateChange(setPrivacy, "showActivity", e.target.checked)} /></div>
            </SettingsRow>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Configuracion;