// import api
// from "../../api/axios";
// export const registerCustomer = async (customer) => {
//     const response =
//         await api.post(
//             "/customer/register",
//             customer
//         );
//     return response.data;
// };

import api from "../../api/axios";
import apiAdmin from "../../api/axiosAdmin";
import nodeApi  from "../../api/axiosNode";

export const registerCustomer = async (customer) => {
    const response = await api.post("/customer/register", customer);
    return response.data;
};

export const getCategories = async () => {
    const res = await apiAdmin.get("/catalog/categories", {
        params: { limit: 200 }
    });
    return res.data;
};

export const createCategory = async (formData) => {
    const res = await apiAdmin.post("/catalog/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

export const createProductSkeleton = async (type, sku) => {
    const res = await apiAdmin.post("/catalog/products", {
        type,
        attribute_family_id: 1,
        sku,
    });
    return res.data;
};

export const updateProductDetails = async (productId, formData) => {
    const res = await apiAdmin.post(
        `/catalog/products/${productId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
};

export const updateProductStock = async (productId, qty) => {
    const res = await apiAdmin.post(
        `/catalog/products/${productId}/inventories`,
        { inventories: { "1": qty } }
    );
    return res.data;
};

export const getProductBySku = async (sku) => {
    const list  = await apiAdmin.get("/catalog/products", {
        params: { limit: 500 }
    });
    const found = list.data.data?.find(
        (p) => p.sku.toLowerCase() === sku.toLowerCase()
    );
    if (!found) return null;

    const detail = await apiAdmin.get(`/catalog/products/${found.id}`);

    // const product = detail.data.data;
    // console.log("Toutes les clés du produit :", Object.keys(product));
    // console.log("categories :", product.categories);

    return detail.data.data;
};

export const getCategoryByProductSku = async (sku) => {
    const catRes    = await getCategories();
    const categories = catRes.data ?? [];

    for (const category of categories) {
        const prodRes  = await api.get("/products", {
            params: { category_id: category.id, limit: 500 }
        });
        const products = prodRes.data?.data ?? [];

        if (products.length === 0) continue;

        const found = products.find(
            (p) => p.sku.toLowerCase() === sku.toLowerCase()
        );

        if (found) {
            console.log(`SKU "${sku}" trouvé dans catégorie #${category.id} — ${category.name}`);
            return category.id;
        }
    }

    console.log(`SKU "${sku}" : aucune catégorie trouvée`);
    return null;
};

export const uploadProductImage = async (productId, product) => {

    const toUrlKey = (name) =>
        name.toLowerCase().trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");

    const categoryId = await getCategoryByProductSku(product.sku);

    const formData = new FormData();
    formData.append("_method",              "PUT");
    formData.append("channel",              "default");
    formData.append("locale",               "fr");
    formData.append("sku",                  product.sku);
    formData.append("name",                 product.name);
    formData.append("url_key",              product.url_key ?? toUrlKey(product.name));
    formData.append("short_description",    product.short_description ?? product.name);
    formData.append("description",          product.description       ?? product.name);
    formData.append("price",                product.price             ?? "0");
    formData.append("cost",                 product.cost              ?? "0");
    formData.append("weight",               product.weight            ?? "200");
    formData.append("status",               "1");
    formData.append("visible_individually", "1");
    formData.append("guest_checkout",       "1");
    formData.append("manage_stock",         "1");
    formData.append("channels[]",           "1");
    formData.append("special_price", product.special_price?? "0");
    formData.append("special_price_from", product.special_price_from);
    formData.append("special_price_to", product.special_price_to);
    if (categoryId) {
        formData.append("categories[]", categoryId);
    }

    formData.append("images[files][]", product.imageFile);

    const res = await apiAdmin.post(
        `/catalog/products/${productId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
};


export const loginCustomer = async (email, password) => {
    const response = await api.post("/customer/login", {
        email,
        password,
        device_name: "react-app"
    });
    console.log("login response :", response.data);
    localStorage.setItem("token", response.data.token);
    console.log("token stocké :", localStorage.getItem("token"));
};

export const addToCartWithToken = async (productId, quantity) => {
    const token = localStorage.getItem("token");
    const response = await api.post(
        `/customer/cart/add/${productId}`,
        {
            product_id: productId,
            quantity,
            is_buy_now: 0
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return response.data;
};

export const updateOrderDate = async (orderId, date, heure) => {
    await nodeApi.patch(`/orders/${orderId}/date`, { date, heure });
};