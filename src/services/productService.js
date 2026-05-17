import api from "../api/axios";

export const getProducts = async () => {
    const response = await api.get("/products");
    return response.data;

};

export const getProductsByCategory = async (categoryId) => {
    const response = await api.get(
        `/products?category_id=${categoryId}`
    );
    return response.data;
};
export const getProductById = async (productId) => {
    const response = await api.get(
        `/products/${productId}`
    );
    return response.data;
};