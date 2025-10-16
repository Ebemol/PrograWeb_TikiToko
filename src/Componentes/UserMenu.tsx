import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

interface UserMenuProps {
  username: string;
  avatarUrl: string;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ username, avatarUrl, onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={menuRef}>
      {/* Botón del usuario */}
      <button
        className="btn d-flex align-items-center text-white"
        style={{ background: "transparent", border: "none" }}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <img
          src={avatarUrl}
          alt="Avatar de usuario"
          className="rounded-circle me-2 border border-secondary"
          width="40"
          height="40"
        />
        <span className="fw-semibold">{username}</span>
        <i className={`bi ms-2 ${open ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
      </button>

      {/* Menú desplegable */}
      {open && (
        <div
          role="menu"
          tabIndex={-1}
          className="position-absolute end-0 mt-3 rounded-4 border-0 shadow-lg overflow-hidden"
          style={{
            minWidth: "260px",
            background: "linear-gradient(180deg, #141414 0%, #0d0d0d 100%)",
            color: "white",
            zIndex: 1050,
            animation: "fadeIn 0.25s ease forwards",
          }}
        >
          {/* Cabecera */}
          <div className="p-3 border-bottom border-secondary d-flex align-items-center">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="rounded-circle me-3 border border-secondary"
              width="50"
              height="50"
            />
            <div>
              <h6 className="mb-0 fw-bold text-white">{username}</h6>
              <small className="text-muted">@{username.toLowerCase()}</small>
            </div>
          </div>

          {/* Opciones */}
          <div className="list-group list-group-flush bg-transparent">
            <button className="list-group-item bg-transparent text-white border-0 d-flex align-items-center py-3">
              <i className="bi bi-person me-3 fs-5"></i> Ver perfil
            </button>

            <button
              className="list-group-item bg-transparent text-white border-0 d-flex align-items-center py-3"
              onClick={() => {
                navigate("/UserSettingsModal");
                setOpen(false);
              }}
            >
              <i className="bi bi-gear me-3 fs-5"></i> Configuración
            </button>

            <button className="list-group-item bg-transparent text-white border-0 d-flex align-items-center py-3">
              <i className="bi bi-question-circle me-3 fs-5"></i> Centro de ayuda
            </button>

            <button
              className="list-group-item bg-transparent text-danger border-0 d-flex align-items-center fw-semibold py-3"
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right me-3 fs-5"></i> Cerrar sesión
            </button>
          </div>
        </div>
      )}

      {/* Animación */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default UserMenu;