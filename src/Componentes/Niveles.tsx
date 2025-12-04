import React, { useEffect, useState } from 'react';

// Imagen por defecto si no tiene avatar
const DEFAULT_AVATAR = "/user-default.png"; 

interface NivelesProps {
  onClose: () => void;
}

const Niveles: React.FC<NivelesProps> = ({ onClose }) => {
  // Estados locales
  const [currentXP, setCurrentXP] = useState<number>(0);
  const [nivel, setNivel] = useState<number>(1);
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
  const [loading, setLoading] = useState<boolean>(true);

  // Meta para el siguiente nivel (Nivel * 100, o la fórmula que uses en tu backend)
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
          // 2. Consulta al Backend (Puerto 5002)
          const response = await fetch(`https://prograweb-tikitoko-backend-lw2q.onrender.com/user/${userId}`);
          const data = await response.json();

          if (data.user) {
            // 3. Actualizar estados con datos frescos
            // Compara si cambió para evitar renderizados innecesarios si quieres, 
            // pero React lo maneja bastante bien.
            setCurrentXP(data.user.xp || 0); 
            setNivel(data.user.nivel || 1);
            setAvatar(data.user.avatar || DEFAULT_AVATAR);
          }
        }
      } catch (error) {
        console.error("Error actualizando niveles:", error);
      } finally {
        setLoading(false);
      }
    };

    // Llamada inicial inmediata
    fetchUserData();

    // 🔥 AUTO-REFRESH: Actualizar cada 3 segundos para ver el progreso en vivo
    const intervalId = setInterval(fetchUserData, 3000);

    // Limpieza al cerrar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Cálculos visuales
  // Aseguramos que no se pase del 100% visualmente
  const percentage = Math.min((currentXP / maxXP) * 100, 100);
  const faltantes = Math.max(0, maxXP - currentXP);

  if (loading) {
    return (
        <div style={{ backgroundColor: '#1c1c1c', color: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #333' }}>
            <div className="spinner-border spinner-border-sm text-danger" role="status"></div> Cargando...
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
        position: 'relative',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '8px', right: '12px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px' }}
      >
        ✕
      </button>

      {/* Avatar Real con Anillo de Nivel */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '10px' }}>
          <img
            src={avatar}
            alt="Perfil"
            style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid #EE1D52', objectFit: 'cover' }}
          />
          {/* Badge de Nivel */}
          <div style={{ 
              position: 'absolute', bottom: '-5px', right: '-5px', 
              backgroundColor: '#EE1D52', color: 'white',
              borderRadius: '50%', width: '28px', height: '28px', 
              fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: 'bold', border: '2px solid #1c1c1c'
          }}>
              {nivel}
          </div>
      </div>

      <h5 style={{ margin: '5px 0', fontWeight: 'bold' }}>Nivel {nivel}</h5>
      
      {/* Estadísticas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>
        <span>XP: {currentXP}</span>
        <span>Meta: {maxXP}</span>
      </div>

      {/* Barra de progreso Animada */}
      <div style={{ width: '100%', backgroundColor: '#333', borderRadius: '10px', height: '14px', overflow: 'hidden', marginBottom: '8px', position: 'relative' }}>
        <div style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, #EE1D52 0%, #ff4d4d 100%)',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '10px'
          }} 
        />
        {/* Texto sobre la barra */}
        <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px', fontWeight: 'bold', textShadow: '0 0 2px black' }}>
            {Math.floor(percentage)}%
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#ccc', marginTop: '10px' }}>
        🚀 Faltan <strong style={{color: '#fff'}}>{faltantes} XP</strong> para subir
      </p>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default Niveles;