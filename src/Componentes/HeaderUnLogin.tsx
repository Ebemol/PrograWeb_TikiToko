import { useNavigate } from "react-router-dom"

const navigate =useNavigate();
const headerunlogin = ()=>{
    return(
    <div>
          <header style={styles.header}>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
          alt="TikTok Logo"
          style={{ height: "40px" }}
          onClick={() => navigate("/")} />
      </header>
    </div>
    )

    
};
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#ffffffff",
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
    backgroundColor: "#fff", // sombra eliminada
    textAlign: "center",
    marginTop: "80px",
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
  },
  mensaje: {
    color: "#555",
    fontSize: "14px",
    marginTop: "10px",
    fontStyle: "italic",
    textAlign: "center",
  },
};
export default headerunlogin;