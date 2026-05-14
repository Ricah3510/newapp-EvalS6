import api from "../api/axios";
const getHeaders = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

};

export const addToCart = async (
        productId,
        quantity
    ) => {
        const token = localStorage.getItem("token");
        const response = await api.post(
            `/customer/cart/add/${productId}`,
            {
                product_id: productId,
                is_buy_now: 0,
                quantity
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            }
        );
        return response.data;
};

export const getCart = async () => {
    const response = await api.get(
        "/customer/cart",
        getHeaders()
    );
    return response.data;
};

export const updateCart = async (qty) => {
    const response = await api.put(
        "/customer/cart/update",
        { qty },
        getHeaders()
    );
    return response.data;
};

export const removeCartItem = async (cartItemId) => {
    const response = await api.delete(
        `/customer/cart/remove/${cartItemId}`,
        getHeaders()
    );
    return response.data;

};

export const clearCart = async () => {
    const response = await api.delete(
        "/customer/cart/remove/",
        getHeaders()
    );
    return response.data;
};