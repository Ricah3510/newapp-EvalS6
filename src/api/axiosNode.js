import axios from "axios";
const nodeApi = axios.create({
    baseURL: import.meta.env.VITE_NODE_API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default nodeApi;