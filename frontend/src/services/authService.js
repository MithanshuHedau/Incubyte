import api from "./api";

export const authService = {
  async register(data) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async login(data) {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
