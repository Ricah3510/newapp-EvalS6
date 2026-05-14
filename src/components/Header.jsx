import "../styles/header.css";
import { Link } from "react-router-dom";
function Header() {

    return (
        <header className="header">
            <Link to={`/`}> <h2> NewApp </h2> </Link>
            <nav>
                <Link to="/panier">Panier</Link>
                <Link to="/orders"> Mes Commandes </Link>
                <Link to="/wishlist">Wishlist</Link>
            </nav>
        </header>
    
    );
}
export default Header;