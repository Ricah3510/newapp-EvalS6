import "../../styles/header.css";
import { Link } from "react-router-dom";
function Header() {

    return (
        <header className="header">
            <Link to={`/admin`}> <h2> NewApp - Admin</h2> </Link>
            <nav>
                <Link to="/admin/orders">Commande</Link>
                <Link to="/admin/product">Stock</Link>
                <Link to="/admin/import-file">ImportFile</Link>
                <Link to="/admin/import-image">ImportImage</Link>
                <Link to="/admin/reset-data">ResetData</Link>
            </nav>
        </header>
    
    );
}
export default Header;