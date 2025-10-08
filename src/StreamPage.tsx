import React from "react";
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
        </div>
      </nav>

      {/* Stream + Chat layout */}
      <div className="container-fluid py-4">
        <div className="row" style={{ height: "calc(100vh - 120px)" }}>
          {/* Stream principal */}
          <div className="col-lg-9 mb-4" style={{ height: "100%" }}>
            <div className="ratio ratio-16x9" style={{ borderRadius: "12px", overflow: "hidden", height: "100%" }}>
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

          {/* Chat al costado ocupando todo el espacio */}
          <div className="col-lg-3" style={{ height: "100%" }}>
            <div
              style={{
                backgroundColor: "#1e1e1e",
                borderRadius: "12px",
                padding: "0",
                height: "100%",
                overflow: "hidden",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ padding: "10px", borderBottom: "1px solid #333" }}>
                <h5 className="mb-0">💬 Chat en vivo</h5>
              </div>
              <iframe
                src="https://vdo.ninja/?view=ebemolStream01&chat&novideo&noaudio&darkmode&transparent&parent=localhost"
                allow="fullscreen"
                frameBorder="0"
                width="100%"
                style={{
                  flexGrow: 1,
                  border: "none",
                  borderRadius: "0 0 12px 12px",
                  backgroundColor: "#1e1e1e",
                }}
                title="Chat VDO.Ninja"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamPage;