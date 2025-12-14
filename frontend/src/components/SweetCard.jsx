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

  return (
    <div className="sweet-card">
      <h3>{sweet.name}</h3>
      <span className="category">{sweet.category}</span>
      <div className="price">₹{sweet.price}</div>
      <div className="stock">
        In Stock: {sweet.quantity} | Sold: {sweet.sold || 0}
      </div>

      <div className="actions">
        {/* User view - purchase button (disabled for admin in read-only mode) */}
        {!isAdminView && (
          <>
            {sweet.quantity > 0 ? (
              readOnly ? (
                <span style={{ color: "#6b7280", fontStyle: "italic" }}>
                  👁️ View Only Mode
                </span>
              ) : (
                <>
                  <input
                    type="number"
                    min="1"
                    max={sweet.quantity}
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(Number(e.target.value))}
                    style={{ width: "60px", marginBottom: 0 }}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => onPurchase(sweet._id, purchaseQty)}
                  >
                    Buy
                  </button>
                </>
              )
            ) : (
              <span style={{ color: "#ef4444", fontWeight: 600 }}>
                Out of Stock
              </span>
            )}
          </>
        )}

        {/* Admin view - edit, delete, restock buttons */}
        {isAdminView && (
          <>
            <button className="btn btn-primary" onClick={() => onEdit(sweet)}>
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(sweet._id)}
            >
              Delete
            </button>
            <div
              style={{
                display: "flex",
                gap: "4px",
                marginTop: "8px",
                width: "100%",
              }}
            >
              <input
                type="number"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(Number(e.target.value))}
                style={{ width: "60px", marginBottom: 0 }}
              />
              <button
                className="btn btn-secondary"
                onClick={() => onRestock(sweet._id, restockQty)}
              >
                Restock
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SweetCard;
