// src/components/admin/Header.jsx (back)
import "../../styles/header.css";
import { NavLink } from "react-router-dom";

function Header() {
    return (
        <header className="header header--admin">

            <NavLink to="/admin">
                <h2>New<span>App</span> — Admin</h2>
            </NavLink>

            <nav>
                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Commandes
                </NavLink>

                <NavLink
                    to="/admin/stock"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Stock
                </NavLink>

                <NavLink
                    to="/admin/import-file"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Import File
                </NavLink>

                <NavLink
                    to="/admin/import-image"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Import Images
                </NavLink>

                <NavLink
                    to="/admin/reset-data"
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Reset Data
                </NavLink>
            </nav>

        </header>
    );
}

export default Header;
