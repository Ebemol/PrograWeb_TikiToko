import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
0
const useBloqueo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, redirige al login
    if (!token) {
      navigate("/", { replace: true }); // replace evita que el usuario use "atrás" para volver
    }
  }, [navigate]);
};

export default useBloqueo;