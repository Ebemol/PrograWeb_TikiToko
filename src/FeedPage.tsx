import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import SlideBar from './Componentes/SlideBar';

const Feed = () => {
  return (
    <div className="bg-black min-vh-100">
      <div className="d-flex">
        {/* Sidebar activo */}
        <SlideBar />

        {/* Contenido principal */}
        <div className="flex-grow-1 d-flex flex-column">
          {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2 py-3">
            <div className="container-fluid">
              {/* Logo */}
              <a className="navbar-brand d-flex align-items-center" href="#" style={{ paddingLeft: '40px' }}>
                <img
                  src="https://cdn.worldvectorlogo.com/logos/tiktok-banner-black-3.svg"
                  alt="TikTok Banner"
                  width="90"
                  height="40"
                  className="d-inline-block align-text-top"
                />
              </a>

              {/* Usuario y monedas */}
              <div className="d-flex align-items-center ms-auto">
                <button
                  className="btn d-flex align-items-center me-3 btn-monedas"
                  style={{ border: 'none', background: 'transparent', color: 'white' }}
                  onClick={() => console.log('Monedas')}
                >
                  <img
                    src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tiktok-round-white-icon.png"
                    alt="Monedas"
                    width="24"
                    height="24"
                    className="me-1 icono-monedas"
                  />
                  <span className="fw-bold texto-monedas">120</span>
                </button>

                <button
                  className="btn d-flex align-items-center btn-perfil"
                  style={{ border: 'none', background: 'transparent', color: 'white' }}
                  onClick={() => console.log('Perfil')}
                >
                  <img
                    src="https://i.imgur.com/KcfC1AP.png"
                    alt="Perfil"
                    className="rounded-circle me-2"
                    width="40"
                    height="40"
                  />
                  <span className="fw-semibold texto-usuario">Progra</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Área de contenido */}
          <div>
<div className="px-4 pt-2">
  <h1 className="text-white fw-bold mb-3">Transmisión destacada</h1>
</div>
         </div>
          
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-start px-4 pt-2">
            <div className="ratio ratio-16x9" style={{ maxWidth: '900px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe
                src="https://www.youtube.com/embed/fQiBogLpqjQ"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
        
      </div>

      <style>
        {`
          .btn-monedas:hover .icono-monedas {
            filter: brightness(0) saturate(100%) invert(23%) sepia(93%) saturate(748%) hue-rotate(330deg) brightness(95%) contrast(101%);
          }

          .btn-monedas:hover .texto-monedas {
            color: #EE1D52;
          }

          .btn-perfil:hover .texto-usuario {
            color: #EE1D52;
          }
        `}
      </style>
    </div>
  );
};

export default Feed;