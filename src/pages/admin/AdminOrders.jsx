import { useEffect, useState } from "react";
import {
    getOrdersAdmin,
    invoiceOrder,
    shipOrder
} from "../../services/admin/orderAdminService";
import MainLayout from "../../layouts/admin/MainLayout";
import "../../styles/admin.css";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await getOrdersAdmin();
            setOrders(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleShip = async (order) => {
        try {
            await shipOrder(order);
            loadOrders();
        } catch (error) {
            console.error(error);
        }
    };

    const handleInvoice = async (order) => {
        try {
            if (order.shipments.length === 0) {
                await shipOrder(order);
            }
            await invoiceOrder(order);
            loadOrders();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MainLayout>
            <div className="page">
                <h1 className="page-title">Gestion Commandes</h1>
                <p className="page-subtitle">Suivi, facturation et expédition des ventes</p>
                <hr className="page-divider" />

                {loading ? (
                    <div className="page-loading">
                        <div className="spinner" />
                        Chargement des commandes...
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    {/* <th>Commande</th> */}
                                    <th>Client</th>
                                    <th>Statut</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                    <th>Livraison</th>
                                    <th>Paiement</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="highlight">#{order.id}</td>
                                        {/* <td>{order.increment_id}</td> */}
                                        <td>
                                            {order.customer_first_name} {order.customer_last_name}
                                        </td>
                                        <td>
                                            <span className={`badge ${order.status === 'processing' ? 'badge--pending' : 'badge--success'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="highlight" style={{ color: 'var(--clr-accent)' }}>
                                            {order.formatted_grand_total}
                                        </td>
                                        <td>
                                            {new Date(order.created_at).toLocaleString("fr-FR", {
                                                dateStyle: "short",
                                                timeStyle: "short"
                                            })}
                                        </td>
                                        <td>
                                            {order.shipments.length === 0 ? (
                                                <button 
                                                    className="btn-table-action" 
                                                    onClick={() => handleShip(order)}
                                                >
                                                    Ship
                                                </button>
                                            ) : (
                                                <span className="badge badge--success">Envoyé</span>
                                            )}
                                        </td>
                                        <td>
                                            {order.invoices.length === 0 ? (
                                                <button 
                                                    className="btn-table-action btn-table-action--accent"
                                                    onClick={() => handleInvoice(order)}
                                                >
                                                    Invoice
                                                </button>
                                            ) : (
                                                <span className="badge badge--success">Payé</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default AdminOrders;