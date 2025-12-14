import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import SweetCard from "../components/SweetCard";
import { sweetService } from "../services/sweetService";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["All", "Chocolate", "Candy", "Pastry", "Indian", "Other"];

function Dashboard() {
  const { isAdmin } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("shop");

  useEffect(() => {
    fetchSweets();
    // Only fetch purchases if not admin (admin can't see their own purchases in user view)
    if (!isAdmin) {
      fetchMyPurchases();
    }
  }, [isAdmin]);

  const fetchSweets = async () => {
    try {
      const data = await sweetService.getAllSweets();
      setSweets(data);
    } catch (error) {
      toast.error("Failed to fetch sweets");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPurchases = async () => {
    try {
      const data = await sweetService.getMyPurchases();
      setPurchases(data);
    } catch (error) {
      console.error("Failed to fetch purchases");
    }
  };

  const handlePurchase = async (id, quantity) => {
    // Prevent admin from purchasing
    if (isAdmin) {
      toast.error("Admins cannot make purchases");
      return;
    }
    try {
      await sweetService.purchaseSweet(id, quantity);
      toast.success("Purchase successful!");
      fetchSweets();
      fetchMyPurchases();
    } catch (error) {
      toast.error(error.response?.data?.message || "Purchase failed");
    }
  };

  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch = sweet.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "All" || sweet.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        {/* Admin viewing user dashboard notice */}
        {isAdmin && (
          <div
            className="card"
            style={{
              background: "#fef3c7",
              borderLeft: "4px solid #d97706",
            }}
          >
            <p style={{ margin: 0, color: "#92400e" }}>
              <strong>👁️ Admin View Mode:</strong> You are viewing the user
              dashboard in read-only mode. Purchases are disabled.
            </p>
          </div>
        )}

        <div className="card">
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <button
              className={`btn ${
                activeTab === "shop" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveTab("shop")}
            >
              🍭 Shop Sweets
            </button>
            {/* Hide purchase history tab for admin in user view */}
            {!isAdmin && (
              <button
                className={`btn ${
                  activeTab === "purchases" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setActiveTab("purchases")}
              >
                📜 My Purchases
              </button>
            )}
          </div>
        </div>

        {activeTab === "shop" && (
          <>
            <div className="card">
              <h2 style={{ marginBottom: "16px" }}>🍭 Browse Sweets</h2>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search sweets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredSweets.length === 0 ? (
              <div className="card">
                <p>No sweets found.</p>
              </div>
            ) : (
              <div className="grid">
                {filteredSweets.map((sweet) => (
                  <SweetCard
                    key={sweet._id}
                    sweet={sweet}
                    onPurchase={handlePurchase}
                    isAdminView={false}
                    readOnly={isAdmin}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "purchases" && !isAdmin && (
          <div className="card">
            <h2 style={{ marginBottom: "16px" }}>📜 My Purchase History</h2>
            {purchases.length === 0 ? (
              <p>You haven't made any purchases yet.</p>
            ) : (
              <div className="table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Sweet</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => (
                      <tr key={purchase._id}>
                        <td>{purchase.sweet?.name || "Deleted Sweet"}</td>
                        <td>
                          <span className="category">
                            {purchase.sweet?.category || "N/A"}
                          </span>
                        </td>
                        <td>{purchase.quantityPurchased}</td>
                        <td
                          style={{
                            color: "#10b981",
                            fontWeight: 600,
                          }}
                        >
                          ₹{purchase.totalPrice}
                        </td>
                        <td>{new Date(purchase.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div
              style={{
                marginTop: "16px",
                padding: "12px",
                background: "#f0fdf4",
                borderRadius: "8px",
              }}
            >
              <strong>Total Spent: </strong>
              <span
                style={{
                  color: "#10b981",
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                ₹{purchases.reduce((sum, p) => sum + p.totalPrice, 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
