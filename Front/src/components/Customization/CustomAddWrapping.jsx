import { useState } from "react";
import { addWrappingPaper } from "../api";
import { useNavigate } from "react-router-dom";

export default function AddWrapping() {
  const [wrappingImage, setWrappingImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wrappingImage) return alert("Select an image!");

    await addWrappingPaper(wrappingImage);
    navigate("/"); // Redirect to main page
  };

  return (
    <div className="form-container">
      <h2>Add Wrapping Paper</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={(e) => setWrappingImage(e.target.files[0])} />
        <button type="submit">Add Wrapping Paper</button>
      </form>
    </div>
  );
}
