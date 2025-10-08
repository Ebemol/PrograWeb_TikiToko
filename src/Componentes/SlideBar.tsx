import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate(); 
  const [visible, setVisible] = useState(true);

  return (
    <div className="d-flex">
      {/* Botón para ocultar/mostrar */}
      <button
        className="btn position-fixed z-3 text-white"
        style={{
          top: '15px',
          left: visible ? '260px' : '10px',
          transition: 'left 0.3s ease, transform 0.3s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          borderRadius: '8px',
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: 'none'
        }}
        onClick={() => setVisible(!visible)}
      >
        <span style={{
          transition: 'transform 0.3s ease',
          display: 'inline-block',
          transform: visible ? 'rotate(0deg)' : 'rotate(90deg)'
        }}>
          {visible ? <i className="bi bi-x-lg"></i> : <i className="bi bi-list"></i>}
        </span>
      </button>

      {/* Sidebar */}
      {visible && (
        <div className="bg-black text-white p-3 min-vh-100 d-flex flex-column justify-content-between" style={{ width: '250px' }}>
          <style>
            {`
              .btn-ebemol {
                color: white;
                background-color: transparent;
                transition: background-color 0.3s ease, color 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 10px;
                padding: 10px 15px;
                margin-bottom: 15px;
                border: none;
                border-radius: 6px;
              }
              .btn-ebemol:hover {
                background-color: #EE1D52;
                color: white;
              }
            `}
          </style>

          {/* Parte superior */}
          <div>
            <button className="btn btn-ebemol w-100">
              <i className="bi bi-compass"></i> Descubrir Live
            </button>

            <button className="btn btn-ebemol w-100">
              <i className="bi bi-broadcast"></i> Emitir Live
            </button>

            <button className="btn btn-ebemol w-100">
              <i className="bi bi-tools"></i> Herramientas de Creadores
            </button>
          </div>

          {/* Parte inferior */}
          <div>
            <button
              className="btn btn-ebemol w-100"
              onClick={() => navigate("/Us")}
            >
              <i className="bi bi-file-earmark-text"></i> Us
            </button>

            <button
              className="btn btn-ebemol w-100"
              onClick={() => navigate("/terms")}
            >
              <i className="bi bi-file-earmark-text"></i> Terms and Conditions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
