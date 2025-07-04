import axios from 'axios';

// ⛳ Use your deployed backend URL here
const API_BASE_URL = "https://carbon-tracker-backend1.onrender.com";

export const calculateFootprint = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/calculate`, formData);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
