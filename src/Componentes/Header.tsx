import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import MiniVentanaPerfil from "./Niveles";
import TikTokCoinIcon from "./Tiktokcoin";

// Imagen por defecto (debe existir en la carpeta public)
const DEFAULT_AVATAR = "/user-default.png"; 

interface HeaderProps {
  showVentanaPerfil: boolean;
  setShowVentanaPerfil: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ showVentanaPerfil, setShowVentanaPerfil }) => {
  const navigate = useNavigate();
  const perfilRef = useRef<HTMLDivElement>(null);

  // --- ESTADOS ---
  const [coins, setCoins] = useState<number>(0);
  const [username, setUsername] = useState<string>("Usuario");
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR); // Estado para la foto

  useEffect(() => {
    const cargarDatosDelBackend = async () => {
      // 1. Obtener el ID desde el LocalStorage
      const stored = localStorage.getItem("user");
      
      if (stored) {
        try {
          const userLocal = JSON.parse(stored);
          const userId = userLocal.id;

          if (userId) {
            // 2. Consultar al Backend (Puerto 5002)
            const response = await fetch(`http://localhost:5002/user/${userId}`);
            
            if (response.ok) {
              const data = await response.json();
              
              if (data.user) {
                // 3. Actualizar la interfaz con los datos REALES
                setCoins(data.user.coins || 0);
                setUsername(data.user.username || "Usuario");
                
                // Si tiene avatar en BD lo usa, si no, usa el default
                setAvatar(data.user.avatar || DEFAULT_AVATAR);

                // Opcional: Mantener localStorage sincronizado
                const usuarioActualizado = { ...userLocal, ...data.user };
                // Quitamos datos pesados del localStorage para no saturarlo (opcional)
                delete usuarioActualizado.avatar; 
                localStorage.setItem("user", JSON.stringify(usuarioActualizado));
              }
            }
          }
        } catch (error) {
          console.error("Error conectando con backend:", error);
        }
      }
    };

    cargarDatosDelBackend();
    
    // Escuchar cambios en localStorage (por si otra pestaña actualiza algo)
    const handleStorageChange = () => cargarDatosDelBackend();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, []);

  // Cerrar menús al hacer click fuera
  const handleOutsideClick = (e: MouseEvent) => {
    if (perfilRef.current && !perfilRef.current.contains(e.target as Node)) {
      setShowVentanaPerfil(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2 py-3">
      <div className="container-fluid">

        {/* Logo */}
        <button
          className="navbar-brand d-flex align-items-center"
          onClick={() => navigate("/feed")}
          style={{ paddingLeft: "40px", border: "none", background: "transparent" }}
        >
          <img
            src="/Multimedia/tiktok-banner.svg"
            alt="TikTok Banner"
            width="90"
            height="40"
            className="d-inline-block align-text-top"
          />
        </button>

        {/* Zona derecha */}
        <div className="d-flex align-items-center ms-auto position-relative" ref={perfilRef}>

          {/* 🔥 Botón de monedas (DINÁMICO) */}
          <button
            className="btn d-flex align-items-center me-3 btn-monedas"
            style={{ border: "none", background: "transparent", color: "white" }}
            onClick={() => navigate("/shop")}
          >
            <TikTokCoinIcon size={24} className="me-1 icono-monedas" />
            <span className="fw-bold texto-monedas">{coins}</span>
          </button>

          {/* Menú de usuario (CON FOTO REAL) */}
          <UserMenu
            username={username}
            avatarUrl={avatar} // <--- Aquí pasamos la foto de la BD
            onLogout={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
            }}
          />

          {/* Mini ventana de perfil */}
          {showVentanaPerfil && (
            <MiniVentanaPerfil
              currentXP={429} // Esto puedes conectarlo a futuro si agregas XP al User
              maxXP={1337}
              onClose={() => setShowVentanaPerfil(false)}
            />
          )}
        </div>
      </div>

      {/* Estilos locales */}
      <style>
        {`
          .btn-monedas:hover .icono-monedas {
            filter: brightness(0) saturate(100%) invert(23%) sepia(93%) saturate(748%) hue-rotate(330deg) brightness(95%) contrast(101%);
          }

          .btn-monedas:hover .texto-monedas {
            color: #EE1D52;
          }
        `}
      </style>
    </nav>
  );
};

export default Header;