import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [sweets, setSweets] = useState([]);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweetsPreview();
  }, []);

  const fetchSweetsPreview = async () => {
    const sampleSweets = [
      {
        _id: 1,
        name: "Chocolate Truffle",
        category: "Chocolate",
        price: 150,
        quantity: 50,
      },
      {
        _id: 2,
        name: "Gulab Jamun",
        category: "Indian",
        price: 80,
        quantity: 100,
      },
      {
        _id: 3,
        name: "Vanilla Cupcake",
        category: "Pastry",
        price: 120,
        quantity: 30,
      },
      {
        _id: 4,
        name: "Fruit Candy",
        category: "Candy",
        price: 20,
        quantity: 200,
      },
      { _id: 5, name: "Rasgulla", category: "Indian", price: 60, quantity: 80 },
      {
        _id: 6,
        name: "Dark Chocolate",
        category: "Chocolate",
        price: 200,
        quantity: 40,
      },
      { _id: 7, name: "Lollipop", category: "Candy", price: 10, quantity: 500 },
      { _id: 8, name: "Brownie", category: "Pastry", price: 100, quantity: 25 },
      { _id: 9, name: "Jalebi", category: "Indian", price: 50, quantity: 120 },
      {
        _id: 10,
        name: "Caramel Candy",
        category: "Candy",
        price: 30,
        quantity: 150,
      },
      {
        _id: 11,
        name: "Kaju Katli",
        category: "Indian",
        price: 250,
        quantity: 60,
      },
      {
        _id: 12,
        name: "Red Velvet Cake",
        category: "Pastry",
        price: 180,
        quantity: 20,
      },
    ];
    setSweets(sampleSweets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      toast.success("Registration successful!");
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Blurred background sweets */}
      <div className="auth-background">
        <div className="auth-background-grid">
          {sweets.map((sweet, index) => (
            <div
              key={sweet._id}
              className="auth-bg-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h4>{sweet.name}</h4>
              <span className="category">{sweet.category}</span>
              <div className="price">₹{sweet.price}</div>
              <div className="stock">Stock: {sweet.quantity}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <img src={logo} alt="Sweet Shop Logo" />
        </div>
        <h2>🍬 Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
