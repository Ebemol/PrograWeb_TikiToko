import React, { useEffect, useState } from "react";

const LiveTimer: React.FC = () => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div style={{
      backgroundColor: "#EE1D52",
      padding: "6px 12px",
      borderRadius: "8px",
      fontWeight: "bold",
      fontSize: "0.95rem",
      color: "white",
      boxShadow: "0 0 6px rgba(255, 0, 90, 0.5)"
    }}>
       Tiempo en vivo: {formatTime(secondsElapsed)}
    </div>
  );
};

export default LiveTimer;
