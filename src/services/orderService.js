import api from "../api/axios";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

};

export const getOrders = async () => {
    const response = await api.get(
        "/customer/orders",
        getHeaders()
    );

    return response.data;

};