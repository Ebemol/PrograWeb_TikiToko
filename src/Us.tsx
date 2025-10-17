import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
  
  const Us = () => {
    const navigate = useNavigate(); 
    
    const team = [
    { name: 'Ebemol', image: '/Multimedia/Ebemol.jpg' },
    { name: 'Rosa MGalindo', image: '/Multimedia/Foto.png' },
    { name: 'Diana', image: '/Multimedia/Diana.jpg' },
    { name: '2', image: 'https://images-ext-1.discordapp.net/external/oyHkGQhVxOkIH9FSku21D82kJ6VePJ_e7HBHUnuUHF4/%3Fs%3D400%26u%3Def07e34efdfa5804bdf9e4f539b7d088f0b14533%26v%3D4/https/avatars.githubusercontent.com/u/207105474?format=webp&width=600&height=600' },
    { name: '3', image: 'https://images-ext-1.discordapp.net/external/oyHkGQhVxOkIH9FSku21D82kJ6VePJ_e7HBHUnuUHF4/%3Fs%3D400%26u%3Def07e34efdfa5804bdf9e4f539b7d088f0b14533%26v%3D4/https/avatars.githubusercontent.com/u/207105474?format=webp&width=600&height=600' },
  ];
    
    return (
      <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
        {/* Header */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2 py-3">
          <div className="container-fluid">
            {/* Logo con navegación */}
            <button
              className="navbar-brand d-flex align-items-center"
              onClick={() => navigate('/feed')}
              style={{ paddingLeft: '40px', border: 'none', background: 'transparent' }}
            >
              <img
                src="https://cdn.worldvectorlogo.com/logos/tiktok-banner-black-3.svg"
                alt="TikTok Banner"
                width="90"
                height="40"
                className="d-inline-block align-text-top"
              />
            </button>
          </div>
        </nav>
  
        {/* Título */}
        <div className="text-center mt-5 mb-4">
          <h1 className="fw-bold" style={{ color: '#fff' }}>Nosotros </h1>
        </div>

         {/* Galería horizontal */}
      <div className="container d-flex justify-content-center" style={{ marginTop: '14vh' }}>
        <div className="d-flex justify-content-center gap-5 flex-wrap">
          {team.map((person, index) => (
            <div key={index} className="text-center">
              <img
                src={person.image}
                alt={person.name}
                style={{
                  width: '220px',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
                }}
              />
              <p className="fw-semibold fs-5 mt-3">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
      
    );
  };
  

export default Us;