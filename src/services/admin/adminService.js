import apiAdmin from "../../api/axiosAdmin";

export const getAdmin = async () => {

    const response = await apiAdmin.get(
        "/get"
    );

    return response.data;
};

export const getProductByIdAdmin = async (productId) => {
    const response = await apiAdmin.get(
        `/catalog/products/${productId}`
    );
    return response.data;
};

export const getProducts = async () => {
    const response = await apiAdmin.get("/catalog/products?limit=1000");
    return response.data;
};