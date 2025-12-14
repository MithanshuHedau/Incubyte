import { useState, useEffect } from "react";

const PREDEFINED_CATEGORIES = [
  "Chocolate",
  "Candy",
  "Pastry",
  "Indian",
  "Other",
];

function SweetModal({ sweet, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Chocolate",
    customCategory: "",
    price: "",
    quantity: "",
  });
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    if (sweet) {
      // Check if category is a predefined one or custom
      const isPredefined = PREDEFINED_CATEGORIES.includes(sweet.category);
      setFormData({
        name: sweet.name,
        category: isPredefined ? sweet.category : "Other",
        customCategory: isPredefined ? "" : sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
      });
      setIsCustomCategory(!isPredefined);
    }
  }, [sweet]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, category: value, customCategory: "" });
    setIsCustomCategory(value === "Other");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine final category
    let finalCategory = formData.category;
    if (formData.category === "Other") {
      if (!formData.customCategory.trim()) {
        alert("Please enter a custom category name");
        return;
      }
      finalCategory = formData.customCategory.trim();
    }

    onSave({
      name: formData.name,
      category: finalCategory,
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
              placeholder="Enter sweet name"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={formData.category} onChange={handleCategoryChange}>
              {PREDEFINED_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Custom category input - shown when "Other" is selected */}
          {isCustomCategory && (
            <div className="form-group custom-category-group">
              <label>Custom Category Name</label>
              <input
                type="text"
                value={formData.customCategory}
                onChange={(e) =>
                  setFormData({ ...formData, customCategory: e.target.value })
                }
                placeholder="Enter your custom category"
                required
                autoFocus
              />
              <small className="helper-text">
                💡 Enter a unique category name for your sweet
              </small>
            </div>
          )}

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
              placeholder="Enter price"
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
              placeholder="Enter quantity"
              required
            />
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {sweet ? "✏️ Update" : "➕ Create"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SweetModal;
