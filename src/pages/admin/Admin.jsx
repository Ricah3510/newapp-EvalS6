import { useEffect, useState } from "react";
import { getAdmin } from "../../services/admin/adminService";
import MainLayout from "../../layouts/admin/MainLayout";
import { Link } from "react-router-dom";
import "../../styles/home.css";

function Admin() {
    const [admin,   setAdmin]   = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdmin();
    }, []);

    const loadAdmin = async () => {
        try {
            const data = await getAdmin();
            setAdmin(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Initiale pour l'avatar
    const initial = admin?.name?.charAt(0).toUpperCase() ?? "A";

    const quickLinks = [
        { to: "/admin/orders",       icon: "", label: "Commandes"    },
        { to: "/admin/stock",      icon: "", label: "Stock"        },
        { to: "/admin/import-file",  icon: "", label: "Import File"  },
        { to: "/admin/import-image", icon: "",  label: "Import Images"},
        { to: "/admin/reset-data",   icon: "",  label: "Reset Data"  },
    ];

    return (
        <MainLayout>
            <div className="page">

                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Bienvenue dans l'espace administration</p>
                <hr className="page-divider" />

                {loading && (
                    <div className="page-loading">
                        <div className="spinner" />
                        Chargement...
                    </div>
                )}

                {!loading && admin && (
                    <div className="admin-welcome">
                        <div className="admin-avatar">{initial}</div>
                        <div className="admin-welcome-info">
                            <h2>{admin.name}</h2>
                            <p>{admin.email}</p>
                        </div>
                    </div>
                )}

                {!loading && (
                    <>
                        <h2 className="page-title" style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                            Accès rapide
                        </h2>
                        <div className="admin-quick-links">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="admin-quick-link"
                                >
                                    <span className="admin-quick-link-icon">{link.icon}</span>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </>
                )}

            </div>
        </MainLayout>
    );
}

export default Admin;
