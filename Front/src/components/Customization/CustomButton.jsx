import "../../styles/Customization/custom.css";

export default function Button({ children, onClick, className }) {
  return (
    <button className={`custom-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
