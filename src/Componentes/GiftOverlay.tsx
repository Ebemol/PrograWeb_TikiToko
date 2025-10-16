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
  }, [visible, onHide]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        animation: "fadeInOut 4s ease-in-out",
      }}
    >
      {/* Aquí puedes reemplazar con una animación, imagen o efecto visual */}
      <img
        src="/assets/rosa-flotante.svg"
        alt="Regalo visual"
        style={{ width: "80px", height: "80px" }}
      />

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
