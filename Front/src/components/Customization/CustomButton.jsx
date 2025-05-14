import "../../styles/Customization/Custom.css";

export default function Button({ children, onClick, className }) {
  return (
    <button className={`custom-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
