import { useEffect, useState } from "react";
import {
    getOrdersAdmin,
    invoiceOrder,
    shipOrder
} from "../../services/admin/orderAdminService";
import MainLayout from "../../layouts/admin/MainLayout";

function AdminOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await getOrdersAdmin();
            console.log(data);
            setOrders(data.data);
        } catch (error) {
            console.error(error);
        }

    };

    const handleShip = async ( order ) => {
    
        try {
            const data = await shipOrder(order);
            console.log(data);
            loadOrders();
    
        } catch (error) {
            console.error(error);
        }
    
    };

    const handleInvoice = async ( order ) => {
    
        try {
            if ( order.shipments.length === 0 ) {
                await shipOrder(order);
            }
            const data = await invoiceOrder(order);
            console.log(data);
            loadOrders();
        } catch (error) {
            console.error(error);
            console.log(
                error.response.data
            );
        }
    };
    return (
        <MainLayout>
        <div>
            <h1>
                Gestion Commandes
            </h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Commande</th>
                        <th>Client</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Livraison</th>
                        <th>Paiement</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        orders.map((order) => (
                            <tr
                                key={order.id}
                            >
                                {console.log(order)}
                                <td>
                                    {order.id}
                                </td>
                                <td>
                                    {
                                        order.increment_id
                                    }
                                </td>
                                <td>
                                    {
                                        order.customer_first_name
                                    }
                                    {" "}
                                    {
                                        order.customer_last_name
                                    }
                                </td>
                                <td>
                                    {order.status}
                                </td>
                                <td>
                                    {
                                        order.formatted_grand_total
                                    }
                                </td>

                                <td>
                                    {
                                        new Date(
                                            order.created_at
                                        )
                                        .toLocaleString(
                                            "fr-FR"
                                        )
                                    }
                                </td>

                                <td>
                                    {
                                        order.shipments.length === 0
                                        ? (
                                            <button onClick={() => handleShip(order) } >
                                                Ship
                                            </button>
                                        )
                                        : (
                                            <span>
                                                Envoyé
                                            </span>
                                        )
                                    }
                                </td>

                                <td>
                                    {
                                        order.invoices.length === 0
                                        ? (
                                            <button onClick={() => handleInvoice(order)}>
                                                Invoice
                                            </button>
                                        )
                                        : (
                                            <span>
                                                Payé
                                            </span>
                                        )
                                    }

                                </td>
                            </tr>
                        ))
                    }
                </tbody>

            </table>
        </div>
        </MainLayout>

    );
}

export default AdminOrders;