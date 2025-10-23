import React from "react";

interface TikTokCoinIconProps {
  size?: number;   
  className?: string; 
  hoverEffect?: boolean; 
}

const TikTokCoinIcon: React.FC<TikTokCoinIconProps> = ({
  size = 40,
  className = "",
  hoverEffect = true,
}) => {
  return (
    <>
      <img
      src="/Multimedia/tiktokcoin.webp"
        alt="Moneda TikTok"
        width={size}
        height={size}
        className={`tiktok-coin-icon ${hoverEffect ? "hover-effect" : ""} ${className}`}
        style={{
          transition: "transform 0.25s ease, filter 0.25s ease",
          cursor: hoverEffect ? "pointer" : "default",
        }}
      />

      {/* Estilos locales para el efecto hover */}
      <style>
        {`
          .tiktok-coin-icon.hover-effect:hover {
            transform: scale(1.1);
            filter: brightness(0) saturate(100%) invert(23%) sepia(93%) 
                    saturate(748%) hue-rotate(330deg) brightness(95%) contrast(101%);
          }
        `}
      </style>
    </>
  );
};

export default TikTokCoinIcon;
