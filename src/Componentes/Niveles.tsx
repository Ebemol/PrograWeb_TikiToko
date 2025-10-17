import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NivelesProps {
  currentXP: number;
  maxXP: number;
  onClose: () => void;
}

const Niveles: React.FC<NivelesProps> = ({ currentXP, maxXP }) => {
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
        position: 'absolute',
        top: '70px',
        right: '20px',
        backgroundColor: '#1c1c1c',
        color: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(255,255,255,0.2)',
        zIndex: 1000,
        width: '250px'
      }}
    >
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
            cursor: 'pointer'
          }}
        />
      </a>

      <h5 className="mb-2 text-center">Nivel 12</h5>
      <p className="mb-1 text-center">EXP: {currentXP} / {maxXP}</p>

      <div className="progress" style={{ height: '10px' }}>
        <div
          className="progress-bar bg-danger"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={currentXP}
          aria-valuemin={0}
          aria-valuemax={maxXP}
        />
      </div>

      <p className="mt-2 text-center" style={{ fontSize: '0.9rem', color: '#ccc' }}>
        ¡Te faltan {maxXP - currentXP} XP para subir de nivel!
      </p>

      {/* Botón cerrar sesión */}
      <button
        onClick={cerrarSesion}
        className="btn btn-outline-light w-100 mt-3"
        style={{ fontSize: '0.9rem' }}
      >
        <i className="bi bi-box-arrow-right me-2" />
        Cerrar sesión
      </button>
    </div>
  );
};

export default Niveles;
