import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

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
        {/* Profile Badge - Clickable */}
        <div className="profile-container">
          <span
            className={`user-badge ${isAdmin ? "admin-badge" : ""}`}
            onClick={() => setShowProfile(!showProfile)}
            style={{ cursor: "pointer" }}
          >
            {user?.name} ({user?.role})
          </span>

          {/* Profile Popup */}
          {showProfile && (
            <>
              <div
                className="profile-overlay"
                onClick={() => setShowProfile(false)}
              ></div>
              <div className="profile-popup">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <h3>Profile Details</h3>
                </div>
                <div className="profile-info">
                  <div className="profile-row">
                    <span className="profile-label">👤 Name</span>
                    <span className="profile-value">{user?.name}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">📧 Email</span>
                    <span className="profile-value">{user?.email}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">🔑 Role</span>
                    <span
                      className={`profile-role ${
                        isAdmin ? "role-admin" : "role-user"
                      }`}
                    >
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-secondary profile-close-btn"
                  onClick={() => setShowProfile(false)}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>

        {/* Admin Panel button only visible to admins */}
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
