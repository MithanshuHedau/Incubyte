import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={logo}
          alt="Sweet Shop Logo"
          style={{ height: "40px", width: "auto" }}
        />
        <h1>Kata Sweet Shop</h1>
      </div>
      <div className="navbar-right">
        <span className={`user-badge ${isAdmin ? "admin-badge" : ""}`}>
          {user?.name} ({user?.role})
        </span>
        {isAdmin && (
          <button
            className="btn btn-secondary"
            onClick={() =>
              navigate(location.pathname === "/admin" ? "/dashboard" : "/admin")
            }
          >
            {location.pathname === "/admin"
              ? "👁️ View User Side"
              : "⚙️ Admin Panel"}
          </button>
        )}
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
