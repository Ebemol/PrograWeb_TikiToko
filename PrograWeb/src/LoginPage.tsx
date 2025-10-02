import { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Usuario:", username, "Contraseña:", password);
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
                <h2 style={styles.title}>Inicia sesión en TikTok</h2>



                {/* Opciones de login rápido */}
                <div style={styles.socialContainer}>
                    <button style={styles.socialBtn}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}>Usar Código QR</button>
                    <button style={styles.socialBtn}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}>Usar teléfono, correo electrónico o nombre de usuario</button>

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
                    <button style={styles.socialBtn}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}>
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/002/520/838/original/apple-logo-black-isolated-on-transparent-background-free-vector.jpg"
                            alt="Google"
                            style={{ width: 20, height: 20, marginRight: 8 }}
                        />
                        Continuar con Apple
                    </button>
                </div>

                <p style={styles.divider}>O inicia sesión con tu cuenta</p>

                {/* Formulario clásico */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Usuario o correo"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />

                    <button type="submit" style={styles.button}>
                        Ingresar
                    </button>
                </form>

                <p style={styles.footer}>
                    ¿No tienes cuenta? <a href="#" style={{ color: '#FE2C55' }}>Regístrarse</a>
                </p>

            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
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
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        textAlign: "center",
        marginTop: "80px",
    },
    title: {
        marginBottom: "20px",
        fontSize: "22px",
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
        marginTop: "20px",
        fontSize: "14px",
        color: "#555",
    },
};

export default Login;
