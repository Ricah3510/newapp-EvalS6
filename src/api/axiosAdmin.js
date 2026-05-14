import axios from "axios";

const apiAdmin = axios.create({

    // baseURL: "http://localhost:8000/api/v1/admin",
    baseURL: import.meta.env.VITE_ADMIN_API_URL,

});

apiAdmin.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "admin_token"
            );

        if (token) {

            config.headers.Authorization
                = `Bearer ${token}`;

        }

        return config;

    }

);

export default apiAdmin;