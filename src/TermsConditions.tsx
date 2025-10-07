import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Conditions from './Componentes/Conditions';
import { useNavigate } from "react-router-dom";

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      {/* Header negro */}
      <div className="container-fluid bg-black px-2 py-3">
        <button
          className="navbar-brand d-flex align-items-center"
          onClick={() => navigate('/feed')}
          style={{ paddingLeft: '40px', border: 'none', background: 'transparent' }}
        >
          <img
            src="https://cdn.worldvectorlogo.com/logos/tiktok-banner-black-3.svg"
            alt="TikTok Banner"
            width="100"
            height="50"
            className="d-inline-block align-text-top"
          />
        </button>
      </div>

      <Conditions />
    </div>
  );
};

export default TermsConditions;