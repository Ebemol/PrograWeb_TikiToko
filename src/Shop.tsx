import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import UserMenu from './Componentes/UserMenu';

const coinPackages = [
  { coins: 30, price: '1.35 PEN' },
  { coins: 350, price: '15.45 PEN' },
  { coins: 700, price: '30.89 PEN' },
  { coins: 1400, price: '61.79 PEN' },
  { coins: 3500, price: '154.45 PEN' },
  { coins: 7000, price: '308.89 PEN' },
  { coins: 17500, price: '772.25 PEN' },
  { coins: 'Personalizar', price: 'Se admiten importes grandes' }
];

const Shop = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

          {/* Usuario y monedas */}
          <div className="d-flex align-items-center ms-auto">
            <button
              className="btn d-flex align-items-center me-3 btn-monedas"
              style={{ border: 'none', background: 'transparent', color: 'white' }}
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

            {/* Menú de usuario con opción de cerrar sesión */}
            <UserMenu
              username="Progra"
              avatarUrl="https://i.imgur.com/KcfC1AP.png"
            />
          </div>
        </div>
      </nav>

      {/* Título */}
      <div className="text-center mt-5 mb-4">
        <h1 className="fw-bold" style={{ color: '#dddada92' }}>Consigue Monedas</h1>
      </div>

      {/* Matriz de paquetes */}
      <div className="container">
        <div className="row g-4 justify-content-center">
          {coinPackages.map((pkg, index) => {
            const isSelected = selectedIndex === index;
            return (
              <div key={index} className="col-6 col-md-4 col-lg-3">
                <div
                  className="d-flex flex-column align-items-center p-3 rounded"
                  style={{
                    backgroundColor: '#1c1c1c',
                    border: isSelected ? '2px solid #ff69b4' : '1px solid #444',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => setSelectedIndex(index)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/tiktok-round-white-icon.png"
                    alt="Moneda"
                    width="40"
                    height="40"
                    className="mb-2"
                  />
                  <div className="fw-bold text-white text-center">
                    {typeof pkg.coins === 'number' ? `${pkg.coins} monedas` : pkg.coins}
                  </div>
                  <div className="text-light small text-center">{pkg.price}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmación */}
        {selectedIndex !== null && (
          <div className="text-center mt-5">
            <p className="text-light">
              Seleccionaste: <strong>{coinPackages[selectedIndex].coins}</strong> – {coinPackages[selectedIndex].price}
            </p>
            <button
              className="btn btn-danger fw-bold px-4 py-2"
              onClick={() => navigate('/pay')}
            >
              Comprar ahora
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;