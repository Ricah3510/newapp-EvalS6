// src/components/Header.jsx (front)
import "../styles/header.css";
import { NavLink } from "react-router-dom";

function Header() {
    return (
        <header className="header">
            <NavLink to="/">
                <h2>New<span>App</span></h2>
            </NavLink>

            <nav>
                <NavLink
                    to="/panier"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Panier
                </NavLink>

                <NavLink
                    to="/orders"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Mes Commandes
                </NavLink>

                <NavLink
                    to="/wishlist"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Wishlist
                </NavLink>
            </nav>

        </header>
    );
}

export default Header;
