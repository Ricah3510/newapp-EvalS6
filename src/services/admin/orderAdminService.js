import apiAdmin
from "../../api/axiosAdmin";

export const getOrdersAdmin = async () => {
    const response = await apiAdmin.get(
        "/sales/orders?sort=id&order=asc&limit=1000"
    );
    return response.data;
};

export const invoiceOrder = async (order) => {

    const items = {};
    order.items.forEach((item) => {
        items[item.id] = item.qty_ordered;
    });

    const response = await apiAdmin.post(
            `/sales/invoices/${order.id}`,
            {
                invoice: {
                    items
                },
                can_create_transaction: 1
            }
        );
    return response.data;
};

// export const shipOrder = async (order) => {

//     const items = {
//         1: {}
//     };
//     order.items.forEach((item) => {
//         items[1][item.id] = item.qty_ordered;
//     });

//     const response = await apiAdmin.post(
//         `/sales/shipments/${order.id}`,
//         {
//             shipment: {
//                 carrier_title: "Free Shipping",
//                 track_number: "TRACK123",
//                 source: 1,
//                 total_qty: order.total_qty_ordered,
//                 items
//             }
//         }

//     );

//     return response.data;

// };

export const shipOrder = async (order) => {

    const items = {};
    order.items.forEach((item) => {
        items[item.id] = {
            1: item.qty_ordered
        };
    });

    const response = await apiAdmin.post(
            `/sales/shipments/${order.id}`,
            {
                shipment: {
                    carrier_title: "Free Shipping",
                    track_number: "TRACK123",
                    source: 1,
                    total_qty: order.total_qty_ordered,
                    items
                }
            }
        );
    return response.data;
};