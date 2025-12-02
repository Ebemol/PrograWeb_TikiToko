import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  return (
    <div className="d-flex">
      {/* Botón para ocultar/mostrar */}
      <button
        className="btn position-fixed z-3 text-white"
        style={{
          top: "15px",
          left: visible ? "260px" : "10px",
          transition: "left 0.3s ease, transform 0.3s ease",
          borderRadius: "8px",
          padding: "8px 12px",
          backgroundColor: "transparent",
          border: "none",
        }}
        onClick={() => setVisible(!visible)}
      >
        <span
          style={{
            transition: "transform 0.3s ease",
            display: "inline-block",
            transform: visible ? "rotate(0deg)" : "rotate(90deg)",
          }}
        >
          {visible ? <i className="bi bi-x-lg"></i> : <i className="bi bi-list"></i>}
        </span>
      </button>

      {/* Sidebar */}
      {visible && (
        <div
          className="text-white p-3 min-vh-100 d-flex flex-column justify-content-between"
          style={{
            width: "250px",
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            boxShadow: "2px 0 6px rgba(0,0,0,0.3)",
            zIndex: 2,
          }}
        >
          <style>
            {`
              .btn-ebemol {
                color: white;
                background-color: transparent;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 10px;
                padding: 10px 15px;
                margin-bottom: 15px;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                position: relative;
                overflow: hidden;
              }

              .btn-ebemol::before {
                content: "";
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, #EE1D52, #ff4b8a);
                transition: all 0.4s ease;
                z-index: 0;
              }

              .btn-ebemol:hover::before {
                left: 0;
              }

              .btn-ebemol span, .btn-ebemol i {
                position: relative;
                z-index: 1;
              }

              .btn-ebemol:hover {
                color: white;
                transform: translateX(4px);
              }

              .btn-small {
                font-size: 0.85rem;
                opacity: 0.8;
                transition: all 0.3s ease;
              }

              .btn-small:hover {
                opacity: 1;
                background-color: rgba(238,29,82,0.1);
                color: #EE1D52;
              }
            `}
          </style>

          {/* Parte superior */}
          <div>
            <button
              className="btn btn-ebemol w-100"
              onClick={() => navigate("/viewer")}
            >
              <i className="bi bi-compass"></i> <span>Descubrir Live</span>
            </button>

            <button
              className="btn btn-ebemol w-100"
              onClick={() => navigate("/golive")}
            >
              <i className="bi bi-broadcast"></i> <span>Emitir Live</span>
            </button>

            <button
              className="btn btn-ebemol w-100"
              onClick={() => navigate("/tools")}
            >
              <i className="bi bi-tools"></i> <span>Herramientas</span>
            </button>
          </div>

          {/* Parte inferior */}
          <div className="mt-auto">
            <button
              className="btn btn-small w-100 text-start text-white"
              onClick={() => navigate("/us")}
            >
              <i className="bi bi-info-circle me-2"></i> Nosotros
            </button>

            <button
              className="btn btn-small w-100 text-start text-white"
              onClick={() => navigate("/terms")}
            >
              <i className="bi bi-file-earmark-text me-2"></i> Términos y condiciones
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
