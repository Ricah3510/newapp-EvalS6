import api from "../api/axios";

export const loginCustomer = async (formData) => {
    const response = await api.post(
        "/customer/login",
        formData
    );
    return response.data;
};