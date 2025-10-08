import React from "react";
import ChatParticipacion from "./Componentes/Chatparticipacion";
import Chatparticipacionnivel from "./Componentes/Chatparticipacionnivel";
import NotificacionNivelStreamer from "./Componentes/NotificacionNivelStreamer";
import { useNavigate } from "react-router-dom";

const StreamPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2 py-3">
        <div className="container-fluid">
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

          <div className="d-flex align-items-center ms-auto">
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

      {/* VDO.Ninja Live Stream Embed */}
      <div className="container py-4">
        <h3 className="mb-3">🎤 Transmitiendo en vivo desde Ebemol</h3>
        <div className="ratio ratio-16x9" style={{ borderRadius: "12px", overflow: "hidden" }}>
          <iframe
            src="https://vdo.ninja/?push=ebemolStream01&webcam&microphone&parent=localhost"
            allow="camera; microphone"
            frameBorder="0"
            width="100%"
            height="100%"
            title="Transmisión Ebemol"
          ></iframe>
        </div>
      </div>

      {/* Notificación de nivel */}
      <div className="container py-3">
        <NotificacionNivelStreamer />
      </div>

      {/* Chat de participación */}
      <div className="container py-3">
        <div className="row">
          <div className="col-md-6 mb-3">
            <ChatParticipacion />
          </div>
          <div className="col-md-6 mb-3">
            <Chatparticipacionnivel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamPage;