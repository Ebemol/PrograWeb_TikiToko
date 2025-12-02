import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Componentes/Header";
import useBloqueo from "../src/hooks/Bloqueo"; // Tu hook de seguridad
import AuthRequired from "./Componentes/AuthRequired"; // <--- Importamos el bloqueo

interface Gift {
  id: number;
  nombre: string;
  costo: number;
  puntos: number;
  emoji: string;
}

const GiftPage: React.FC = () => {
  const navigate = useNavigate();
  useBloqueo(); // Hook extra

  // --- LÓGICA DE PROTECCIÓN (ANTI-BYPASS) ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    setLoadingAuth(false);
  }, []);
  // ------------------------------------------

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [form, setForm] = useState<Gift>({
    id: 0,
    nombre: "",
    costo: 0,
    puntos: 0,
    emoji: "🎁",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showVentanaPerfil, setShowVentanaPerfil] = useState(false);
  
  const emojis = ["🎁", "🌹", "⭐", "💎", "🔥", "🎉", "💖", "🍀", "👑", "🧸", "🐍", "🎄", "🎅", "🎤", "⚽", "🏈", "🕯️", "🎨"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "nombre" ? value : Number(value)
    }));
  };

  const handleEmojiSelect = (emoji: string) => {
    setForm(prev => ({ ...prev, emoji }));
  };

  const handleSubmit = () => {
    if (form.nombre.trim() === "") return;

    if (editingId !== null) {
      setGifts(prev =>
        prev.map(g => (g.id === editingId ? { ...form, id: editingId } : g))
      );
      setEditingId(null);
    } else {
      setGifts(prev => [...prev, { ...form, id: Date.now() }]);
    }

    setForm({ id: 0, nombre: "", costo: 0, puntos: 0, emoji: "🎁" });
  };

  const handleEdit = (gift: Gift) => {
    setForm(gift);
    setEditingId(gift.id);
  };

  const handleDelete = (id: number) => {
    setGifts(prev => prev.filter(g => g.id !== id));
  };

  // --- 1. ESTADO DE CARGA (Pantalla negra) ---
  if (loadingAuth) {
    return <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}></div>;
  }

  // --- 2. ESTADO BLOQUEADO (Si no hay login) ---
  if (!isAuthorized) {
    return (
      <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column" }}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2 py-3">
            <div className="container-fluid">
                <button className="navbar-brand d-flex align-items-center" onClick={() => navigate("/feed")} style={{ border: "none", background: "transparent" }}>
                    <img src="https://cdn.worldvectorlogo.com/logos/tiktok-banner-black-3.svg" alt="TikTok Banner" width="90" height="40" className="d-inline-block align-text-top" />
                </button>
            </div>
        </nav>
        <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AuthRequired />
        </div>
      </div>
    );
  }

  // --- 3. DISEÑO ORIGINAL (Si está logueado) ---
  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      {/* Header Original */}
      <Header
        showVentanaPerfil={showVentanaPerfil}
        setShowVentanaPerfil={setShowVentanaPerfil}
      />

      {/* Contenido */}
      <div style={{ padding: "30px" }}>
        <div className="text-center mb-4">
          <h2>Gestor de Regalos</h2>
        </div>

        {/* Contenedor central estilizado */}
        <div
          className="d-flex justify-content-center align-items-start mb-5"
          style={{
            gap: "40px",
            flexWrap: "wrap",
            backgroundColor: "#1e1e1e",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* Formulario */}
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <label className="form-label text-white">Nombre del regalo</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Rosa, Estrella, Corazón"
              value={form.nombre}
              onChange={handleChange}
              className="form-control mb-3"
            />

            <label className="form-label text-white">Costo (en monedas)</label>
            <input
              type="number"
              name="costo"
              placeholder="Ej: 100"
              value={form.costo}
              onChange={handleChange}
              className="form-control mb-3"
              style={{ appearance: "textfield", MozAppearance: "textfield" }}
            />

            <label className="form-label text-white">Puntos que otorga</label>
            <input
              type="number"
              name="puntos"
              placeholder="Ej: 10"
              value={form.puntos}
              onChange={handleChange}
              className="form-control mb-3"
              style={{ appearance: "textfield", MozAppearance: "textfield" }}
            />
          </div>

          {/* Selector de emojis */}
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <label className="form-label text-white">Selecciona un emoji</label>
            <div
              className="d-flex flex-wrap"
              style={{ gap: "10px", paddingTop: "5px" }}
            >
              {emojis.map((em, idx) => (
                <button
                  key={idx}
                  className={`btn btn-sm ${form.emoji === em ? "btn-danger" : "btn-outline-light"}`}
                  onClick={() => handleEmojiSelect(em)}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botón central */}
        <div className="text-center mb-5">
          <button className="btn btn-danger px-5" onClick={handleSubmit}>
            {editingId !== null ? "Actualizar regalo" : "Agregar regalo"}
          </button>
        </div>

        {/* Lista de regalos */}
        <ul className="list-group">
          {gifts.map(gift => (
            <li key={gift.id} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
              <div>
                <strong>{gift.emoji} {gift.nombre}</strong> — 💰 {gift.costo} — ⭐ {gift.puntos}
              </div>
              <div>
                <button className="btn btn-sm btn-outline-light me-2" onClick={() => handleEdit(gift)}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(gift.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GiftPage;