// src/api.js
import axios from 'axios';

const API_BASE_URL = "http://localhost:5000";

export const calculateFootprint = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/calculate`, formData);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
