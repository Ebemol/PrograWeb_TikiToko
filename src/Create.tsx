import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Create = () => {
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [name, setname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dayborn, setDayborn] = useState(""); // Nuevo estado para fecha
  const [genere, setGenere] = useState("");   // Nuevo estado para género

  // Estados de control UI
  const [mensaje, setMensaje] = useState("");
  const [cuentaCreada, setCuentaCreada] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Para deshabilitar botón mientras carga
  
  const navigate = useNavigate();

  function esCorreoValido(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensaje(""); // Limpiar mensajes previos

    // --- 1. Validaciones Frontend ---
    if (!esCorreoValido(email)) {
      setMensaje("Ingresa un correo válido");
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!dayborn) {
      setMensaje("Por favor ingresa tu fecha de nacimiento");
      return;
    }

    if (!genere) {
      setMensaje("Por favor selecciona un género");
      return;
    }

    // --- 2. Enviar al Backend ---
    setIsLoading(true);
    
    try {
      const response = await fetch("https://prograweb-tikitoko-backend-lw2q.onrender.com/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          username,
          genere,
          dayborn
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Éxito (Código 201)
        setMensaje(`¡Cuenta creada para ${username}! 🎉`);
        setCuentaCreada(true);
      } else {
        // Error del backend (ej: usuario ya existe)
        setMensaje(data.error || "Error al crear la cuenta");
        setCuentaCreada(false);
      }

    } catch (error) {
      console.error("Error de conexión:", error);
      setMensaje("No se pudo conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  // Redireccionar si la cuenta se creó con éxito
  useEffect(() => {
    if (cuentaCreada) {
      const timer = setTimeout(() => navigate("/feed")); // Redirigir al login
      return () => clearTimeout(timer);
    }
  }, [cuentaCreada, navigate]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
          alt="TikTok Logo"
          style={{ height: "40px", cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </header>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Crear cuenta</h2>
        <div style={{color: "#666", marginBottom: "10px"}}>Ingrese sus datos para Continuar</div>
        
        <input 
          type="email"
          placeholder="Ingrese Su Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="Ingrese Su nombre"
          value={name}
          onChange={(e) => setname(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="text"
          placeholder="Ingrese Su nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        
        <div style={{textAlign: "left", fontSize: "14px", color: "#555"}}>Ingrese su fecha de nacimiento</div>
        <input
          type="date"
          className="form-control"
          id="fechaNacimiento"
          name="fechaNacimiento"
          style={styles.input}
          value={dayborn}
          onChange={(e) => setDayborn(e.target.value)}
          required
        ></input>

        <div className="container">
          <div className="d-flex gap-3 align-items-center justify-content-center my-3">
            
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="genereOption"
                id="opcion1"
                value="hombre"
                onChange={(e) => setGenere(e.target.value)}
                checked={genere === "hombre"}
              />
              <label className="fw-semibold form-check-label" htmlFor="opcion1">
                Hombre
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="genereOption"
                id="opcion2"
                value="mujer"
                onChange={(e) => setGenere(e.target.value)}
                checked={genere === "mujer"}
              />
              <label className="fw-semibold form-check-label" htmlFor="opcion2">
                Mujer
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="genereOption"
                id="opcion3"
                value="transformer"
                onChange={(e) => setGenere(e.target.value)}
                checked={genere === "transformer"}
              />
              <label className="fw-semibold form-check-label" htmlFor="opcion3">
              Transformer              
              </label>
            </div>

          </div>
        </div>

        <button type="submit" style={isLoading ? {...styles.button, backgroundColor: "#ccc"} : styles.button} disabled={isLoading}>
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>

        {mensaje && (
          <p
            style={{
              ...styles.mensaje,
              color: cuentaCreada ? "#28a745" : "#dc3545",
            }}
          >
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh", // Cambiado a minHeight para pantallas pequeñas
    backgroundColor: "#fff",
    padding: "20px 0",
  },
  header: {
    position: "absolute",
    top: "20px",
    left: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    marginBottom: "10px",
    fontSize: "30px",
    fontWeight: "bold",
    color: "#111",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "12px",
    backgroundColor: "#fe2c55",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s",
  },
  mensaje: {
    fontSize: "14px",
    marginTop: "10px",
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default Create;