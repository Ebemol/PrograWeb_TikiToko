import React from 'react';
// import { useNavigate } from 'react-router-dom'; // No es estrictamente necesario aquí si es solo modal

interface NivelesProps {
  currentXP: number;
  maxXP: number;
  nivelActual?: number; // Nueva prop
  onClose: () => void;
}

const Niveles: React.FC<NivelesProps> = ({ currentXP, maxXP, nivelActual = 1, onClose }) => {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);
  const faltantes = maxXP - currentXP;

  return (
    <div style={{
        backgroundColor: '#1c1c1c',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
        width: '260px',
        border: '1px solid #333',
        textAlign: 'center'
      }}
    >
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '8px', right: '12px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px' }}
      >
        ✕
      </button>

      {/* Avatar (Placeholder) */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
          <img
            src="https://i.imgur.com/KcfC1AP.png"
            alt="Perfil"
            style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid #EE1D52', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#EE1D52', borderRadius: '50%', width: '24px', height: '24px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {nivelActual}
          </div>
      </div>

      <h5 style={{ margin: '5px 0', fontWeight: 'bold' }}>Nivel {nivelActual}</h5>
      <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#aaa' }}>
        Próximo nivel: {maxXP} XP
      </p>

      {/* Barra de progreso */}
      <div style={{ width: '100%', backgroundColor: '#333', borderRadius: '6px', height: '12px', overflow: 'hidden', marginBottom: '8px' }}>
        <div style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #EE1D52 0%, #ff4d4d 100%)', // Gradiente para que se vea moderno
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }} 
        />
      </div>

      <p style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '10px' }}>
        🔥 ¡Solo te faltan <strong style={{color: '#fff'}}>{faltantes} XP</strong>!
      </p>
    </div>
  );
};

export default Niveles;