import axios from 'axios';

const API_BASE = '/api/admin';

interface LoginResponse {
  success: boolean;
  token: string;
  message?: string;
}

export const adminService = {
  async loginAdmin(username: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${API_BASE}/login`, {
      username,
      password,
    });
    return response.data;
  },

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE}/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.success;
    } catch {
      return false;
    }
  },

  async getAdminProducts(token: string) {
    const response = await axios.get(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async createProduct(token: string, data: any) {
    const response = await axios.post(`${API_BASE}/products`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateProduct(token: string, id: string, data: any) {
    const response = await axios.put(`${API_BASE}/products/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deleteProduct(token: string, id: string) {
    const response = await axios.delete(`${API_BASE}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getAdminCategories(token: string) {
    const response = await axios.get(`${API_BASE}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getAdminOrders(token: string) {
    const response = await axios.get(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getAnalytics(token: string) {
    const response = await axios.get(`${API_BASE}/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
