import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import MiniVentanaPerfil from "./Niveles";
import TikTokCoinIcon from "./Tiktokcoin";
import axios from "axios";

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
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);

  // Función para leer datos locales (Carga inmediata)
  const cargarDatosLocales = () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setCoins(user.coins || 0);
        setUsername(user.username || "Usuario");
        // Si hay avatar guardado (base64), usarlo; si no, el default
        setAvatar(user.avatar || DEFAULT_AVATAR);
      } catch (error) {
        console.error("Error leyendo localStorage", error);
      }
    }
  };

  useEffect(() => {
    // 1. Carga inicial rápida desde LocalStorage
    cargarDatosLocales();

    // 2. PETICIÓN AL BACKEND (Coins + Avatar actualizados)
    const token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");

    // Si no hay userId suelto, intentamos sacarlo del objeto "user"
    if (!userId) {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          userId = u.id;
        } catch (e) { console.error(e); }
      }
    }

    if (userId) {
      // Usamos el endpoint del backend (puerto 5002)
      axios.get(`http://localhost:5002/user/${userId}`)
      .then(res => {
        // Adaptamos la respuesta según venga (res.data o res.data.user)
        const userData = res.data.user || res.data; 

        if (userData) {
          // A. Actualizar estados visuales del Header
          setCoins(userData.coins || 0);
          setAvatar(userData.avatar || DEFAULT_AVATAR); // <--- Foto real
          setUsername(userData.username || "Usuario");

          // B. Actualizar LocalStorage para persistencia
          const storedUser = localStorage.getItem("user");
          let u = storedUser ? JSON.parse(storedUser) : {};
          
          // Fusionamos lo nuevo con lo viejo
          u = { ...u, ...userData };
          localStorage.setItem("user", JSON.stringify(u));
        }
      })
      .catch((err) => console.log("Error obteniendo datos del usuario:", err));
    }

    // 3. Listener para mantener sincronía entre pestañas
    const handleStorageChange = () => cargarDatosLocales();
    window.addEventListener("storage", handleStorageChange);
    
    // Opcional: Intervalo suave para refrescar monedas si cambian en otra parte
    const intervalId = setInterval(cargarDatosLocales, 3000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };

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

          {/* Botón de monedas */}
          <button
            className="btn d-flex align-items-center me-3 btn-monedas"
            style={{ border: "none", background: "transparent", color: "white" }}
            onClick={() => navigate("/shop")}
          >
            <TikTokCoinIcon size={24} className="me-1 icono-monedas" />
            <span className="fw-bold texto-monedas">{coins}</span>
          </button>

          {/* Menú de usuario (Pasamos la URL del avatar real) */}
          <UserMenu
            username={username}
            avatarUrl={avatar} 
            onLogout={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                navigate("/login");
            }}
          />

          {/* Mini ventana de perfil (Opcional) */}
          {showVentanaPerfil && (
            <MiniVentanaPerfil
              onClose={() => setShowVentanaPerfil(false)}
            />
          )}
        </div>
      </div>

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