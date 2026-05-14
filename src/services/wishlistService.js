import api from "../api/axios";

const getHeaders = () => {

    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization:
                `Bearer ${token}`
        }
    };
};

export const toggleWishlist = async (productId) => {

    const response =
        await api.post(`/customer/wishlist/${productId}`,
            {},
            getHeaders()
        );
    return response.data;
};

export const getWishlist = async () => {

    const response = await api.get(
            "/customer/wishlist",
            getHeaders()
        );
    return response.data;

};

export const moveWishlistToCart = async (
        productId,
        quantity = 1
    ) => {

    const response = await api.post(
            `/customer/wishlist/${productId}/move-to-cart`,
            {},
            {
                ...getHeaders(),
                params: {
                    quantity
                }
            }
        );
    return response.data;
};

export const clearWishlist = async () => {
    const response = await api.delete(
            "/customer/wishlist/all",
            getHeaders()
        );
    return response.data;
};