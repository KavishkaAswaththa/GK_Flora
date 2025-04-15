import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const fetchFlowers = async () => {
  try {
    const response = await axios.get(`${API_URL}/flowers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching flowers:", error);
    return [];
  }
};

export const fetchWrappingPapers = async () => {
  try {
    const response = await axios.get(`${API_URL}/wrappingPapers`);
    return response.data;
  } catch (error) {
    console.error("Error fetching wrapping papers:", error);
    return [];
  }
};

export const addFlower = async (flowerName, flowerImage) => {
  const formData = new FormData();
  formData.append("name", flowerName);
  formData.append("image", flowerImage);

  await axios.post(`${API_URL}/flowers`, formData);
};

export const addWrappingPaper = async (wrappingImage) => {
  const formData = new FormData();
  formData.append("image", wrappingImage);

  await axios.post(`${API_URL}/wrappingPapers`, formData);
};
