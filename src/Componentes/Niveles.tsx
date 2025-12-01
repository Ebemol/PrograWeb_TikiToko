import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NivelesProps {
  currentXP: number;
  maxXP: number;
  onClose: () => void;
}

const Niveles: React.FC<NivelesProps> = ({ currentXP, maxXP, onClose }) => {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        // 1. ELIMINAMOS position, top y right para que respete al padre LiveChat
        backgroundColor: '#1c1c1c',
        color: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)', // Sombra un poco más oscura para contraste
        width: '250px',
        // zIndex no es necesario aquí si el padre ya lo tiene, pero no estorba
      }}
    >
      {/* Botón de cerrar (X) que faltaba para usar la prop onClose */}
      <button 
        onClick={onClose}
        style={{
            position: 'absolute',
            top: '5px',
            right: '10px',
            background: 'none',
            border: 'none',
            color: '#aaa',
            cursor: 'pointer',
            fontSize: '16px'
        }}
      >
        ✕
      </button>

      <a href="https://tuperfil.com/progra" target="_blank" rel="noopener noreferrer">
        <img
          src="https://i.imgur.com/KcfC1AP.png"
          alt="Perfil"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '12px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            cursor: 'pointer',
            border: '2px solid #ff4d4d' // Un borde para que destaque
          }}
        />
      </a>

      <h5 style={{textAlign: 'center', margin: '0 0 8px 0'}}>Nivel 12</h5>
      <p style={{textAlign: 'center', margin: '0 0 10px 0', fontSize: '14px'}}>EXP: {currentXP} / {maxXP}</p>

      {/* Barra de progreso */}
      {/* Usamos estilos en línea por si Bootstrap no está cargado */}
      <div style={{ width: '100%', backgroundColor: '#444', borderRadius: '5px', height: '10px', overflow: 'hidden' }}>
        <div
          style={{ 
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: '#dc3545', // Color rojo (danger de bootstrap)
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      <p style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.85rem', color: '#ccc' }}>
        ¡Te faltan {maxXP - currentXP} XP para subir!
      </p>
      <button 
        onClick={cerrarSesion}
        style={{
            marginTop: '15px',
            width: '100%',
            padding: '8px',
            backgroundColor: '#333',
            border: '1px solid #555',
            color: 'white',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px'
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Niveles;