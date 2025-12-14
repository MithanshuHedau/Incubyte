import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar";
import SweetCard from "../components/SweetCard";
import SweetModal from "../components/SweetModal";
import { sweetService } from "../services/sweetService";

function AdminDashboard() {
  const [sweets, setSweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [activeTab, setActiveTab] = useState("sweets");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    fetchSweets();
    fetchUsers();
    fetchAllPurchases();
  }, []);

  const fetchSweets = async () => {
    try {
      const data = await sweetService.getAllSweets();
      setSweets(data);

      // Extract unique categories from sweets
      const uniqueCategories = ["All", ...new Set(data.map((s) => s.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error("Failed to fetch sweets");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await sweetService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users");
    }
  };

  const fetchAllPurchases = async () => {
    try {
      const data = await sweetService.getAllPurchases();
      setPurchases(data);
    } catch (error) {
      console.error("Failed to fetch purchases");
    }
  };

  const handleCreate = () => {
    setEditingSweet(null);
    setShowModal(true);
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingSweet) {
        await sweetService.updateSweet(editingSweet._id, data);
        toast.success("Sweet updated!");
      } else {
        await sweetService.createSweet(data);
        toast.success("Sweet created!");
      }
      setShowModal(false);
      fetchSweets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return;
    try {
      await sweetService.deleteSweet(id);
      toast.success("Sweet deleted!");
      fetchSweets();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleRestock = async (id, quantity) => {
    try {
      await sweetService.restockSweet(id, quantity);
      toast.success("Restocked!");
      fetchSweets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Restock failed");
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
        <div className="card">
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              className={`btn ${
                activeTab === "sweets" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveTab("sweets")}
            >
              🍬 Manage Sweets
            </button>
            <button
              className={`btn ${
                activeTab === "users" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveTab("users")}
            >
              👥 View Users
            </button>
            <button
              className={`btn ${
                activeTab === "purchases" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveTab("purchases")}
            >
              🧾 Purchase History
            </button>
          </div>
        </div>

        {activeTab === "sweets" && (
          <>
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <h2>🍬 Manage Sweets</h2>
                <button className="btn btn-success" onClick={handleCreate}>
                  + Add Sweet
                </button>
              </div>
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
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredSweets.length === 0 ? (
              <div className="card">
                <p>No sweets found. Add some!</p>
              </div>
            ) : (
              <div className="grid">
                {filteredSweets.map((sweet) => (
                  <SweetCard
                    key={sweet._id}
                    sweet={sweet}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRestock={handleRestock}
                    isAdminView={true}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "users" && (
          <div className="card">
            <h2 style={{ marginBottom: "16px" }}>👥 Registered Users</h2>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "purchases" && (
          <div className="card">
            <h2 style={{ marginBottom: "16px" }}>🧾 All Purchase History</h2>
            {purchases.length === 0 ? (
              <p>No purchases yet.</p>
            ) : (
              <>
                <div className="table-wrapper">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Sweet</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map((purchase) => (
                        <tr key={purchase._id}>
                          <td>{purchase.user?.name || "Deleted User"}</td>
                          <td>{purchase.user?.email || "N/A"}</td>
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
                          <td>
                            {new Date(purchase.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "#f0fdf4",
                    borderRadius: "8px",
                    display: "flex",
                    gap: "24px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>Total Revenue: </strong>
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
                  <div>
                    <strong>Total Orders: </strong>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "18px",
                      }}
                    >
                      {purchases.length}
                    </span>
                  </div>
                  <div>
                    <strong>Total Items Sold: </strong>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "18px",
                      }}
                    >
                      {purchases.reduce(
                        (sum, p) => sum + p.quantityPurchased,
                        0
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <SweetModal
          sweet={editingSweet}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
