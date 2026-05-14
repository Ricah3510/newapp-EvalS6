import apiAdmin from "../../api/axiosAdmin";

export const getAdmin = async () => {

    const response = await apiAdmin.get(
        "/get"
    );

    return response.data;
};