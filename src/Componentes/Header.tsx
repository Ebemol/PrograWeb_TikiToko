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

  /* ============================
        🔥 NUEVO: Coins dinámicas
     ============================ */
  const [coins, setCoins] = useState<number>(0);

  useEffect(() => {
    // Cargar coins de localStorage al iniciar
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setCoins(user.coins || 0);
      } catch {}
    }

    // Escuchar cambios en localStorage
    const onStorage = () => {
      const s = localStorage.getItem("currentUser");
      if (s) {
        const u = JSON.parse(s);
        setCoins(u.coins || 0);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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

          {/* 🔥 Botón de monedas (AHORA DINÁMICO) */}
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
            username="Progra"
            avatarUrl="https://i.imgur.com/KcfC1AP.png"
            onLogout={() => alert("Sesión cerrada")}
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
