import api from "./api";

export const sweetService = {
  async getAllSweets() {
    const response = await api.get("/sweets");
    return response.data;
  },

  async searchSweets(params) {
    const response = await api.get("/sweets/search", { params });
    return response.data;
  },

  async createSweet(data) {
    const response = await api.post("/sweets", data);
    return response.data;
  },

  async updateSweet(id, data) {
    const response = await api.put(`/sweets/${id}`, data);
    return response.data;
  },

  async deleteSweet(id) {
    const response = await api.delete(`/sweets/${id}`);
    return response.data;
  },

  async purchaseSweet(id, quantity) {
    const response = await api.post(`/sweets/${id}/purchase`, { quantity });
    return response.data;
  },

  async restockSweet(id, quantity) {
    const response = await api.post(`/sweets/${id}/restock`, { quantity });
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get("/sweets/allUsers");
    return response.data;
  },

  async getMyPurchases() {
    const response = await api.get("/sweets/my-purchases");
    return response.data;
  },

  async getAllPurchases() {
    const response = await api.get("/sweets/all-purchases");
    return response.data;
  },
};
