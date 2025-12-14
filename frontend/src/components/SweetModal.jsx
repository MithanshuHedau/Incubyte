import { useState, useEffect } from "react";

const CATEGORIES = ["Chocolate", "Candy", "Pastry", "Indian", "Other"];

function SweetModal({ sweet, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Other",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
      });
    }
  }, [sweet]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{sweet ? "Edit Sweet" : "Add New Sweet"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
            />
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {sweet ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SweetModal;
