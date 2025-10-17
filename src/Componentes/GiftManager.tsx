
import React, { useState } from "react";

interface Gift {
  id: number;
  nombre: string;
  costo: number;
  puntos: number;
}

const GiftManager: React.FC = () => {
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
    <div style={{ padding: "20px", backgroundColor: "#1c1c1c", color: "white", borderRadius: "12px" }}>
      <h3 className="mb-3">🎁 Gestor de Regalos</h3>

      <div className="mb-3">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del regalo"
          value={form.nombre}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="costo"
          placeholder="Costo"
          value={form.costo}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <input
          type="number"
          name="puntos"
          placeholder="Puntos"
          value={form.puntos}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <button className="btn btn-danger" onClick={handleSubmit}>
          {editingId !== null ? "Actualizar regalo" : "Agregar regalo"}
        </button>
      </div>

      <ul className="list-group">
        {gifts.map(gift => (
          <li key={gift.id} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white">
            <div>
              <strong>{gift.nombre}</strong> — 💰 {gift.costo} — ⭐ {gift.puntos}
            </div>
            <div>
              <button className="btn btn-sm btn-outline-light me-2" onClick={() => handleEdit(gift)}>✏️</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(gift.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GiftManager;
