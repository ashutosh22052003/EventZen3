import axios from "axios";

const API_BASE_URL = "http://localhost:5267/api/auth"; // Ensure this is correct

export const registerUser = async (userData) => {
  return axios.post(`${API_BASE_URL}/register`, userData);
};

export const loginUser = async (credentials) => {
  return axios.post(`${API_BASE_URL}/login`, credentials);
};
