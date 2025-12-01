import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserMenu from "./UserMenu";
import MiniVentanaPerfil from "./Niveles";
import TikTokCoinIcon from "./Tiktokcoin";

interface HeaderProps {
  showVentanaPerfil: boolean;
  setShowVentanaPerfil: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ showVentanaPerfil, setShowVentanaPerfil }) => {
  const navigate = useNavigate();
  const perfilRef = useRef<HTMLDivElement>(null);

  const [coins, setCoins] = useState<number>(0);
  // Opcional: Estados para nombre y avatar si quieres que también vengan del back
  const [username, setUsername] = useState<string>("Usuario");

  useEffect(() => {
    const cargarDatosDelBackend = async () => {
      // 1. Obtener el ID desde el LocalStorage
      const stored = localStorage.getItem("user");
      
      if (stored) {
        try {
          const userLocal = JSON.parse(stored);
          const userId = userLocal.id; // Sacamos el ID

          if (userId) {
            // 2. Consultar al Backend con ese ID
            // AVISO: Asegúrate que el puerto sea el correcto (5002 o 4000)
            const response = await fetch(`http://localhost:5002/user/${userId}`);
            
            if (response.ok) {
              const data = await response.json();
              
              // 3. Actualizar las monedas con el dato REAL de la base de datos
              if (data.user) {
                setCoins(data.user.coins);
                setUsername(data.user.username || "Usuario");
                
                // Opcional: Actualizamos el localStorage para que esté sincronizado
                const usuarioActualizado = { ...userLocal, coins: data.user.coins };
                localStorage.setItem("user", JSON.stringify(usuarioActualizado));
              }
            }
          }
        } catch (error) {
          console.error("Error cargando datos del usuario:", error);
        }
      }
    };

    cargarDatosDelBackend();
  }, []); // Se ejecuta solo al montar el componente

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

          {/* 🔥 Botón de monedas (Datos traídos del Backend) */}
          <button
            className="btn d-flex align-items-center me-3 btn-monedas"
            style={{ border: "none", background: "transparent", color: "white" }}
            onClick={() => navigate("/shop")}
          >
            <TikTokCoinIcon size={24} className="me-1 icono-monedas" />
            <span className="fw-bold texto-monedas">{coins}</span>
          </button>

          {/* Menú de usuario */}
          <UserMenu
            username={username} // Ahora usa el nombre real
            avatarUrl="https://i.imgur.com/KcfC1AP.png"
            onLogout={() => {
                localStorage.removeItem("user"); // Borrar user al salir
                localStorage.removeItem("token");
                navigate("/login");
            }}
          />

          {/* Mini ventana de perfil */}
          {showVentanaPerfil && (
            <MiniVentanaPerfil
              currentXP={429}
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

          .btn-perfil:hover .texto-usuario {
            color: #EE1D52;
          }
        `}
      </style>
    </nav>
  );
};

export default Header;