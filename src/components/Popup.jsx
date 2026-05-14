import "../styles/popup.css";
function Popup({ message, type }) {
    const navigate = useNavigate();
    return (
        <div className={`popup ${type}`}>
            <p>{message}</p>
        </div>
    );
}

export default Popup;