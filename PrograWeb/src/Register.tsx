import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Register = () => {

    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };
    return (
        <div style={styles.container}>
            {/* Header con el logo arriba a la izquierda */}
            <header style={styles.header}>
                <img
                    src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg"
                    alt="TikTok Logo"
                    style={{ height: "40px" }}
                />
            </header>

            <div style={styles.card}>
                <h2 style={styles.title}>Regístrate en TikTok</h2>
                <div style={styles.footer}>Crea un perfil, sigue otras cuentas, graba tus propios videos y más. </div>


                {/* Opciones de login rápido */}
                <div style={styles.socialContainer}>
                    <button style={styles.socialBtn}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}>Usar Código QR</button>

                    <button style={styles.socialBtn}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}>                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                            alt="Facebook"
                            style={{ width: 20, height: 20, marginRight: 8 }}
                        />
                        Continuar con Facebook
                    </button>

                    <button style={styles.socialBtn}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}>
                        <img
                            src="https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0"
                            alt="Google"
                            style={{ width: 20, height: 20, marginRight: 8 }}
                        />
                        Continuar con Google
                    </button>

                </div>




                <p style={styles.footer}>
                    ¿Ya tienes una cuenta?{" "}
                    <span
                        style={{
                            color: "#FE2C55",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontStyle: "normal"
                        }}
                        onClick={() => navigate("/")}
                    >
                        Iniciar Sesión
                    </span>
                </p>

            </div>
        </div>
    )
}
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
    card: {
        width: "400px",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.1)",
        backgroundColor: "#fff",
        textAlign: "center",
        marginTop: "80px",
    },
    title: {
        marginBottom: "20px",
        fontSize: "35px",
        fontWeight: "bold",
        color: "#111",
    },
    socialContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginBottom: "20px",
    },
    socialBtn: {
        padding: "12px",
        fontSize: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    divider: {
        fontSize: "14px",
        color: "#888",
        margin: "15px 0",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
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
    footer: {
        marginTop: "30px",
        marginBottom: "20px", fontSize: "14px",
        color: "color: #AAA",
    }

};

export default Register;