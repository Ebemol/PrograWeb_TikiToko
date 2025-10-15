import React, { useEffect, useState } from "react";

interface Props {
  visible: boolean;
  regalo: string;
  espectador: string;
  onHide: () => void;
}

const GiftOverlay: React.FC<Props> = ({ visible, regalo, espectador, onHide }) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onHide();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!show) return null;

  return (
    <div style={{
      position: "absolute",
      top: "20%",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#f33464ff",
      color: "white",
      padding: "20px 30px",
      borderRadius: "12px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      boxShadow: "0 0 20px rgba(255,0,90,0.6)",
      animation: "fadeInOut 4s ease-in-out",
      zIndex: 9999
    }}>
    {espectador} te ha enviado: <span style={{ textDecoration: "underline" }}>{regalo}</span>
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) scale(0.9); }
            10% { opacity: 1; transform: translateX(-50%) scale(1); }
            90% { opacity: 1; transform: translateX(-50%) scale(1); }
            100% { opacity: 0; transform: translateX(-50%) scale(0.9); }
          }
        `}
      </style>
    </div>
  );
};

export default GiftOverlay;

