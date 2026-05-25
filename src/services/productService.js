import api from "../api/axios";

export const getProducts = async () => {
    const response = await api.get("/products");
    return response.data;
};

export const getProductsSansPagination = async () => {
    const response = await api.get("/products", {
        params: {pagination: 0},
    }
    );
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


export const isPromo = (product) => {
    if (!product.special_price) return false;
    
    const regular = parseFloat(product.regular_price ?? product.price);
    const special  = parseFloat(product.special_price);
    
    if (isNaN(regular) || isNaN(special)) return false;
    
    if (product.special_price_from && product.special_price_to) {
        const now   = new Date();
        const from  = new Date(product.special_price_from);
        const to    = new Date(product.special_price_to);
        if (now < from || now > to) return false;
    }
    
    return special < regular;
};

export const getDiscount = (product) => {
    if (!isPromo(product)) return null;
    const regular = parseFloat(product.regular_price ?? product.price);
    const special  = parseFloat(product.special_price);
    return Math.round(((regular - special) / regular) * 100);
};