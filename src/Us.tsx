import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
  
  const Us = () => {
    const navigate = useNavigate(); 
    
    const team = [
    { name: 'Ebemol', image: 'https://scontent.flim15-1.fna.fbcdn.net/v/t39.30808-6/482059474_3846083625705537_123261346664933849_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=iDDHPAtZqzIQ7kNvwEYSX8t&_nc_oc=Adndv6VU95BjiV6cY3Eg66pSO4ZlGmk_6brq9qwPZiwQnRosBVo7WasU708pWVy7PV4&_nc_zt=23&_nc_ht=scontent.flim15-1.fna&_nc_gid=s1kh6j_Z9R1kKcu4NM7BNA&oh=00_AfczLBkhFdeIH_BisTfk9ZH3fcZoqYVYFJaimxEQtaFxyQ&oe=68EBB6CF' },
    { name: 'Rosa MGalindo', image: 'https://cdn.discordapp.com/attachments/1102664324553658442/1425322861614075944/Foto1.jpg?ex=68e72adb&is=68e5d95b&hm=1dcd54c050711b09701f3aeffb8c6bcf5040c0d145bc9be8b216cfacdb21dda9&' },
    { name: 'María Rivas', image: 'https://images-ext-1.discordapp.net/external/oyHkGQhVxOkIH9FSku21D82kJ6VePJ_e7HBHUnuUHF4/%3Fs%3D400%26u%3Def07e34efdfa5804bdf9e4f539b7d088f0b14533%26v%3D4/https/avatars.githubusercontent.com/u/207105474?format=webp&width=600&height=600' },
    { name: 'Carlos Peña', image: 'https://images-ext-1.discordapp.net/external/oyHkGQhVxOkIH9FSku21D82kJ6VePJ_e7HBHUnuUHF4/%3Fs%3D400%26u%3Def07e34efdfa5804bdf9e4f539b7d088f0b14533%26v%3D4/https/avatars.githubusercontent.com/u/207105474?format=webp&width=600&height=600' },
    { name: 'Sofía León', image: 'https://images-ext-1.discordapp.net/external/oyHkGQhVxOkIH9FSku21D82kJ6VePJ_e7HBHUnuUHF4/%3Fs%3D400%26u%3Def07e34efdfa5804bdf9e4f539b7d088f0b14533%26v%3D4/https/avatars.githubusercontent.com/u/207105474?format=webp&width=600&height=600' },
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