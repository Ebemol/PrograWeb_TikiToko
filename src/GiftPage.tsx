import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Gift {
  id: number;
  nombre: string;
  costo: number;
  puntos: number;
}

const GiftPage: React.FC = () => {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [form, setForm] = useState<Gift>({ id: 0, nombre: "", costo: 0, puntos: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "nombre" ? value : Number(value)
    }));
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

    setForm({ id: 0, nombre: "", costo: 0, puntos: 0 });
  };

  const handleEdit = (gift: Gift) => {
    setForm(gift);
    setEditingId(gift.id);
  };

  const handleDelete = (id: number) => {
    setGifts(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "100vh", color: "white" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black px-2 py-3">
        <div className="container-fluid">
          <button
            className="navbar-brand d-flex align-items-center"
            onClick={() => navigate("/feed")}
            style={{ border: "none", background: "transparent" }}
          >
            <img
              src="https://cdn.worldvectorlogo.com/logos/tiktok-banner-black-3.svg"
              alt="TikTok Banner"
              width="90"
              height="40"
              className="d-inline-block align-text-top"
            />
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <div style={{ padding: "30px" }}>
        {/* Título centrado */}
        <div className="text-center mb-4">
          <h2>Gestor de Regalos</h2>
        </div>

        {/* Formulario centrado con etiquetas */}
        <div className="d-flex flex-column align-items-center mb-5">
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
            />

            <label className="form-label text-white">Puntos que otorga</label>
            <input
              type="number"
              name="puntos"
              placeholder="Ej: 10"
              value={form.puntos}
              onChange={handleChange}
              className="form-control mb-3"
            />

            <button className="btn btn-danger w-100" onClick={handleSubmit}>
              {editingId !== null ? "Actualizar regalo" : "Agregar regalo"}
            </button>
          </div>
        </div>

        {/* Lista de regalos */}
        <ul className="list-group">
          {gifts.map(gift => (
            <li key={gift.id} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
              <div>
                <strong>{gift.nombre}</strong> — 💰 {gift.costo} — ⭐ {gift.puntos}
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
