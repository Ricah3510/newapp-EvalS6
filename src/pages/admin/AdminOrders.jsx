import { useEffect, useState } from "react";
import {
    getOrdersAdmin,
    invoiceOrder,
    shipOrder,
    cancledOrder
} from "../../services/admin/orderAdminService";
import MainLayout from "../../layouts/admin/MainLayout";
import "../../styles/admin.css";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedTrie, setSelectedTrie] = useState("");
    useEffect(() => {
        loadOrders();
    }, []);
    const filteredOrders = orders
        .filter((order) => {
            if ( selectedStatus === "" ) {
                return true;
            }
            return ( order.status === selectedStatus );
        })
        .sort((a, b) => {
            if (selectedTrie === "") {
                return a.id - b.id;
            }else if( selectedTrie === "montant"){
                return a.grand_total - b.grand_total;
            }else if( selectedTrie === "date"){
                return new Date(a.created_at) - new Date(b.created_at);
            }else if( selectedTrie === "customer_first_name"){
                return a.customer_first_name.localeCompare(b.customer_first_name);
            }
            return 0;
        });
    
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
            // if (order.shipments.length === 0) {
            //     await shipOrder(order);
            // }
            await invoiceOrder(order);
            loadOrders();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCanceld = async (order) => {
        try {
            await cancledOrder(order);
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
                {/* <select value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value ) }
                >
                    <option value=""> Tous </option>
                    <option value="pending"> Pending </option>
                    <option value="processing"> Processing </option>
                    <option value="completed"> Completed </option>
                    <option value="canceled"> Canceled </option>
                </select>
                    <select value={selectedTrie}
                        onChange={(e) => setSelectedTrie(e.target.value) }
                    >
                        <option value=""> Colonne de trie</option>
                        <option value="montant"> Montant </option>
                        <option value="date"> Date </option>
                        <option value="customer_first_name"> Nom client </option>
                    </select> */}
                    <br />
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
                                    {/* <th>Annulation</th> */}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="highlight">#{order.id}</td>
                                        {/* <td>{order.increment_id}</td> */}
                                        <td>
                                            {order.customer_first_name} {order.customer_last_name}
                                        </td>
                                        <td>
                                            {/* <span className={`badge
                                                    ${order.status === 'processing'
                                                    ? 'badge--processing'
                                                    : 'badge--success'}`
                                                }> */}
                                                <span className={`badge
                                                    ${order.status === 'processing'
                                                    ? 'badge--processing'
                                                    : order.status === 'pending'
                                                    ? 'badge--pending'
                                                    : order.status === 'canceled'
                                                    ? 'badge--canceled'
                                                    : 'badge--success'}`
                                                }>
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
                                        {/* <td>
                                            {(order.invoices.length === 0 && order.status != "canceled") ? (
                                                <button
                                                    className="btn-table-action btn-table-action--danger"
                                                    onClick={() => handleCanceld(order)}
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <span className="badge badge--success">----</span>
                                            )}
                                        </td> */}
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