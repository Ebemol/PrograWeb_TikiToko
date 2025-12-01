import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import Header from './Componentes/Header'; 
import TikTokCoinIcon from './Componentes/Tiktokcoin';

const coinPackages = [
  { coins: 30, price: '1.35 PEN' },
  { coins: 350, price: '15.45 PEN' },
  { coins: 800, price: '30.89 PEN' },
  { coins: 1400, price: '61.79 PEN' },
  { coins: 3500, price: '154.45 PEN' },
  { coins: 7000, price: '308.89 PEN' },
  { coins: 17500, price: '772.25 PEN' },
  { coins: 'Personalizar', price: 'Se admiten importes grandes' }
];

const Shop = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState(''); 
  const [showVentanaPerfil, setShowVentanaPerfil] = useState(false); 

  const handleSelected = (index: number) => {
    setSelectedIndex(index);
    if (coinPackages[index].coins !== 'Personalizar') setCustomAmount('');
  }

  // --- LÓGICA NUEVA: Preparar datos para el pago ---
  const irAPagar = () => {
    if (selectedIndex === null) return;

    let cantidadMonedas = 0;
    let precio = "";

    if (coinPackages[selectedIndex].coins === 'Personalizar') {
        cantidadMonedas = Number(customAmount);
        precio = "Variable"; 
    } else {
        cantidadMonedas = Number(coinPackages[selectedIndex].coins);
        precio = coinPackages[selectedIndex].price;
    }

    // Enviamos los datos a la página /pay
    navigate('/pay', { 
        state: { 
            coins: cantidadMonedas, 
            price: precio 
        } 
    });
  };

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <Header showVentanaPerfil={showVentanaPerfil} setShowVentanaPerfil={setShowVentanaPerfil} />

      <div className="text-center mt-5 mb-4">
        <h1 className="fw-bold" style={{ color: '#dddada92' }}>Consigue Monedas</h1>
      </div>

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
                  onClick={() => handleSelected(index)}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <TikTokCoinIcon size={24} className="me-1 icono-monedas" />
                  <div className="fw-bold text-white text-center">
                    {typeof pkg.coins === 'number' ? `${pkg.coins} monedas` : pkg.coins}
                  </div>
                  <div className="text-light small text-center">{pkg.price}</div>
                </div>
              </div>
            );
          })}
        </div>

       {selectedIndex !== null && coinPackages[selectedIndex].coins === 'Personalizar' && (
          <div className="text-end mt-3">
            <input
              type="number"
              placeholder="Ingresa tu importe"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              className="form-control text-white p-2"
              style={{
                backgroundColor: '#1c1c1c',
                borderRadius: '1px',
                width: '100%',     
                marginLeft: 'auto', 
                maxWidth: '300px', 
              }}
            />
          </div>
        )}

        {selectedIndex !== null && (
          <div className="text-center mt-3">
            <p className="text-light fs-13">
              Seleccionaste: <strong>
                {coinPackages[selectedIndex].coins === 'Personalizar' 
                  ? customAmount || '–' 
                  : coinPackages[selectedIndex].coins}
              </strong> – {coinPackages[selectedIndex].price}
            </p>
            <button
              className="btn btn-danger fw-bold px-5 py-2 rounded-pill"
              onClick={irAPagar}
              disabled={coinPackages[selectedIndex].coins === 'Personalizar' && !customAmount}
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