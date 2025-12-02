import React, { useEffect, useState } from 'react';

// Imagen por defecto si no tiene avatar
const DEFAULT_AVATAR = "/user-default.png"; 

interface NivelesProps {
  onClose: () => void;
}

const Niveles: React.FC<NivelesProps> = ({ onClose }) => {
  // Estados locales para los datos
  const [currentXP, setCurrentXP] = useState<number>(0);
  const [nivel, setNivel] = useState<number>(1);
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  const [loading, setLoading] = useState<boolean>(true);

  // Lógica de cálculo (Basada en tu backend: Nivel * 10 = MaxXP del nivel)
  const maxXP = nivel * 10; 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 1. Obtener ID del localStorage
        const stored = localStorage.getItem("user");
        if (!stored) return;
        
        const userLocal = JSON.parse(stored);
        const userId = userLocal.id;

        if (userId) {
          // 2. Consulta al Backend
          const response = await fetch(`http://localhost:5002/user/${userId}`);
          const data = await response.json();

          if (data.user) {
            // 3. Actualizar estados con datos reales de la DB
            // Usamos 'coins' como XP temporalmente según tu backend anterior, 
            // o 'xp' si ya lo agregaste a tu schema.
            // Aquí asumo que usas el campo 'xp' que definimos en el último schema.
            setCurrentXP(data.user.xp || 0); 
            setNivel(data.user.nivel || 1);
            setAvatar(data.user.avatar || DEFAULT_AVATAR);
          }
        }
      } catch (error) {
        console.error("Error cargando niveles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Cálculos visuales
  const percentage = Math.min((currentXP / maxXP) * 100, 100);
  const faltantes = Math.max(0, maxXP - currentXP);

  if (loading) {
    return (
        <div style={{ backgroundColor: '#1c1c1c', color: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
            Cargando...
        </div>
    );
  }

  return (
    <div style={{
        backgroundColor: '#1c1c1c',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
        width: '260px',
        border: '1px solid #333',
        textAlign: 'center',
        position: 'relative' // Necesario para la 'X' absoluta
      }}
    >
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '8px', right: '12px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px' }}
      >
        ✕
      </button>

      {/* Avatar Real */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
          <img
            src={avatar}
            alt="Perfil"
            style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid #EE1D52', objectFit: 'cover' }}
          />
          {/* Bolita con el nivel */}
          <div style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#EE1D52', borderRadius: '50%', width: '24px', height: '24px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {nivel}
          </div>
      </div>

      <h5 style={{ margin: '5px 0', fontWeight: 'bold' }}>Nivel {nivel}</h5>
      
      {/* Estadísticas */}
      <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#aaa' }}>
        XP Actual: {currentXP} / Meta: {maxXP}
      </p>

      {/* Barra de progreso */}
      <div style={{ width: '100%', backgroundColor: '#333', borderRadius: '6px', height: '12px', overflow: 'hidden', marginBottom: '8px' }}>
        <div style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #EE1D52 0%, #ff4d4d 100%)',
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