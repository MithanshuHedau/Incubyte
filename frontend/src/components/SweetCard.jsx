import { useState } from "react";

function SweetCard({
  sweet,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
  isAdminView = false,
  readOnly = false,
}) {
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [restockQty, setRestockQty] = useState(10);

  const isOutOfStock = sweet.quantity === 0;

  return (
    <div
      className={`sweet-card ${isOutOfStock ? "out-of-stock" : ""}`}
      data-category={sweet.category}
    >
      <h3>{sweet.name}</h3>
      <span className="category">{sweet.category}</span>
      <div className="price">₹{sweet.price}</div>
      <div className="stock">
        <span className="stock-item in-stock">
          📦 In Stock: <strong>{sweet.quantity}</strong>
        </span>
        <span className="stock-item sold">
          🛒 Sold: <strong>{sweet.sold || 0}</strong>
        </span>
      </div>

      <div className="actions">
        {/* User view - purchase button (disabled for admin in read-only mode) */}
        {!isAdminView && (
          <>
            {!isOutOfStock ? (
              readOnly ? (
                <span className="view-only-badge">👁️ View Only Mode</span>
              ) : (
                <>
                  <input
                    type="number"
                    min="1"
                    max={sweet.quantity}
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(Number(e.target.value))}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => onPurchase(sweet._id, purchaseQty)}
                  >
                    🛍️ Buy Now
                  </button>
                </>
              )
            ) : (
              <span
                style={{
                  color: "#ef4444",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                ❌ Out of Stock
              </span>
            )}
          </>
        )}

        {/* Admin view - edit, delete, restock buttons */}
        {isAdminView && (
          <>
            <button className="btn btn-primary" onClick={() => onEdit(sweet)}>
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(sweet._id)}
            >
              🗑️ Delete
            </button>
            <div className="restock-section">
              <input
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(Number(e.target.value))}
              />
              <button
                className="btn btn-secondary"
                onClick={() => onRestock(sweet._id, restockQty)}
                style={{ flex: 1 }}
              >
                📦 Restock
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SweetCard;
