import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cuentaCreada, setCuentaCreada] = useState(false);
  const navigate = useNavigate();

  function esCorreoValido(correo: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!esCorreoValido(username)) {
      setMensaje("Ingresa un correo válido");
      setCuentaCreada(false);
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      setCuentaCreada(false);
      return;
    }

    setMensaje(`¡Cuenta creada para ${username}! 🎉`);
    setCuentaCreada(true);
  }

  useEffect(() => {
    if (cuentaCreada) {
      const timer = setTimeout(() => navigate("/feed"), 1500);
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
        <div>Ingrese sus datos para Continuar</div>
        <input type="email"
          placeholder="Ingrese Su Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Ingrese Su nombre"
          value={name}
          onChange={(e) => setname(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Ingrese Su nombre de ususario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <div>Ingreses su fecha de nacimiento</div>
        <input
          type="date"
          className="form-control"
          id="fechaNacimiento"
          name="fechaNacimiento"
          style={styles.input}
          required></input>

        <div className="container">
          <div className="d-flex gap-3 align-items-center justify-content-center my-3">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="opcion"
                id="opcion1"
                value="hombre"
              />
              <label className="form-check-label fw-semibold text-primary" htmlFor="opcion1">
                Hombre
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="opcion"
                id="opcion2"
                value="mujer"
              />
              <label className="form-check-label fw-semibold text-danger" htmlFor="opcion2">
                Mujer
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="opcion"
                id="opcion3"
                value="nah"
              />
              <label className="form-check-label fw-semibold text-danger" htmlFor="opcion3">
                Prefiero no detallarlo
              </label>
            </div>




          </div>



        </div>


        <button type="submit" style={styles.button}>
          Registrarse
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
    height: "100vh",
    backgroundColor: "#fff",
    overflow: "hidden",
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
    marginBottom: "20px",
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
    fontStyle: "italic",
    textAlign: "center",
  },
};

export default Create;