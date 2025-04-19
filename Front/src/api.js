import axios from "axios";

export const addFlower = async (name, image) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("image", image);

  return axios.post("http://localhost:8080/api/flowers", formData);
};
