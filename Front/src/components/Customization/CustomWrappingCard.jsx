import "../../styles/Customization/Custom.css";

export default function WrappingCard({ wrapping, onSelect }) {
    return (
      <div className="card">
        <img src={wrapping.imageUrl} alt="Wrapping Paper" className="card-img" />
        <button className="select-btn" onClick={() => onSelect(wrapping)}>
          Select
        </button>
      </div>
    );
  }
  