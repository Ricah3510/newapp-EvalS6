import api from "../api/axios";

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

};

export const saveAddress = async (data) => {
    const response = await api.post(
        "/customer/checkout/save-address",
        data,
        getHeaders()
    );
    return response.data;

};

export const saveShipping = async ( shippingMethod ) => {

    const response = await api.post(
        "/customer/checkout/save-shipping",
        {
            shipping_method: shippingMethod
        },
            getHeaders()

    );
    return response.data;
};

export const savePayment = async ( paymentMethod ) => {

    const response = await api.post(
        "/customer/checkout/save-payment",
        {
            payment: {
                method: paymentMethod
            }
        },
        getHeaders()
    );

    return response.data;

};

export const saveOrder = async () => {

    const response = await api.post(
        "/customer/checkout/save-order",
        {},
        getHeaders()
    );

    return response.data;

};