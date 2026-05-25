import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getOrders } from "../services/orderService";
import "../styles/home.css";
import "../styles/orders.css";

const StatusBadge = ({ status }) => {
    const map = {
        pending:    "pending",
        processing: "processing",
        completed:  "completed",
        canceled:   "canceled",
    };
    const labels = {
        pending:    "Pending",
        processing: "Processing",
        completed:  "Completed",
        canceled:   "Canceled",
    };
    return (
        <span className={`order-status ${map[status] ?? ""}`}>
            {labels[status] ?? status}
        </span>
    );
};

function Orders() {
    const [orders,  setOrders]  = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="page">

                <h1 className="page-title">Mes Commandes</h1>
                <p className="page-subtitle">
                    {loading ? "Chargement..." : `${orders.length} commande(s)`}
                </p>
                <hr className="page-divider" />

                {loading && (
                    <div className="page-loading">
                        <div className="spinner" />
                        Chargement des commandes...
                    </div>
                )}

                {!loading && orders.length === 0 && (
                    <div className="orders-empty">
                        <span className="orders-empty-icon"></span>
                        <h2>Aucune commande</h2>
                        <p>Vous n'avez pas encore passé de commande.</p>
                        <Link to="/" className="btn btn--accent">
                            Découvrir nos produits
                        </Link>
                    </div>
                )}

                {!loading && orders.length > 0 && (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} className="order-card">

                                <div className="order-card-info">
                                    <span className="order-ref">
                                        Commande #{order.increment_id}
                                    </span>
                                    <span className="order-date">
                                        {new Date(order.created_at).toLocaleString("fr-FR")}
                                    </span>
                                    <StatusBadge status={order.status} />
                                </div>

                                <div className="order-card-total">
                                    <p className="order-total">
                                        {order.formatted_grand_total}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </MainLayout>
    );
}

export default Orders;
