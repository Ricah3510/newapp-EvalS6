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