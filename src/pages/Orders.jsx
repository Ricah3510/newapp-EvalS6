import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import { getOrders } from "../services/orderService";

function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await getOrders();
            console.log(data);
            setOrders(data.data);

        } catch (error) {
            console.error(error);
        }

    };

    return (

        <MainLayout>
            <h1>Mes Commandes</h1>
            {
                orders.map((order) => (

                    <div
                        key={order.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "15px"
                        }}
                    >

                        <h3>
                            Commande :
                            {" "}
                            {order.increment_id}
                        </h3>

                        <p>
                            Status :
                            {" "}
                            {order.status}
                        </p>

                        <p>
                            Total :
                            {" "}
                            {order.formatted_grand_total}
                        </p>

                        <p>
                            Date :
                            {" "}

                            {
                                new Date(order.created_at)
                                    .toLocaleString("fr-FR")
                            }

                        </p>

                    </div>

                ))
            }

        </MainLayout>

    );

}

export default Orders;