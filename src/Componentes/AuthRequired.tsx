import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AuthRequired: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="d-flex flex-column align-items-center justify-content-center h-100"
      style={{ 
        minHeight: "60vh", // Altura mínima para que se vea centrado
        backgroundColor: "#000", // Fondo negro
        color: "#fff",
        textAlign: "center",
        padding: "20px"
      }}
    >
      {/* Icono de candado o usuario */}
      <div style={{ 
        width: "100px", 
        height: "100px", 
        backgroundColor: "#1f1f1f", 
        borderRadius: "50%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        marginBottom: "24px"
      }}>
        <i className="bi bi-person-lock" style={{ fontSize: "3rem", color: "#EE1D52" }}></i>
      </div>

      <h2 style={{ fontWeight: "800", marginBottom: "12px" }}>
        Inicia sesión en TikTok
      </h2>
      
      <p style={{ color: "#aaa", maxWidth: "400px", marginBottom: "32px", fontSize: "1.1rem" }}>
        Necesitas una cuenta para ver este contenido, chatear, dar likes y seguir a tus creadores favoritos.
      </p>

      {/* Botones de Acción */}
      <div className="d-flex flex-column gap-3 w-100" style={{ maxWidth: "320px" }}>
        
        {/* Botón Login */}
        <button
          onClick={() => navigate("/")}
          className="btn"
          style={{
            backgroundColor: "#EE1D52",
            color: "white",
            fontWeight: "bold",
            padding: "12px",
            fontSize: "1.1rem",
            borderRadius: "8px",
            border: "none",
            transition: "transform 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          Iniciar Sesión
        </button>

        {/* Botón Registro */}
        <button
          onClick={() => navigate("/create")}
          className="btn"
          style={{
            backgroundColor: "transparent",
            color: "#fff",
            fontWeight: "bold",
            padding: "12px",
            fontSize: "1.1rem",
            borderRadius: "8px",
            border: "1px solid #444"
          }}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  );
};

export default AuthRequired;