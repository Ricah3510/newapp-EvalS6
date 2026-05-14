import api from "../api/axios";

export const getCategories = async (url = null) => {
    const response = url
        ? await api.get(url)
        : await api.get("/categories?sort=id&order=asc");
    return response.data;
};