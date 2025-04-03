import "../styles/Custom.css";

export default function FlowerCard({ image, name, onSelect }) {
  // If the image is from the backend, use it. Otherwise, use a local asset.
  const imageUrl = image ? image : "/images/placeholder.jpg";

  return (
    <div className="card">
      <img src={imageUrl} alt={name} className="card-image" />
      {name && <p className="card-text">{name}</p>}
      {onSelect && <button className="select-button" onClick={onSelect}>Select</button>}
    </div>
  );
}
