import { folder, forEach } from "jszip";
import api from "../../api/axios";
import {getOrdersAdmin} from "./orderAdminService";
import {updateProductStock} from "./importService";
import nodeApi from "../../api/axiosNode";
import { getProductByIdAdmin, getProducts } from "./adminService";
import apiAdmin from "../../api/axiosAdmin";


const DEFAULT_CUSTOMER = {
    email:      "stock.checker@system.com",
    password:   "StockChecker123!",
    first_name: "Stock",
    last_name:  "Checker"
};

const STOCK_MAX = 100;

const getDefaultCustomerToken = async () => {
    try {
        const res = await api.post("/customer/login", {
            email:       DEFAULT_CUSTOMER.email,
            password:    DEFAULT_CUSTOMER.password,
            device_name: "stock-checker"
        });
        return res.data.token;
    } catch {
        await api.post("/customer/register", {
            first_name:            DEFAULT_CUSTOMER.first_name,
            last_name:             DEFAULT_CUSTOMER.last_name,
            email:                 DEFAULT_CUSTOMER.email,
            password:              DEFAULT_CUSTOMER.password,
            password_confirmation: DEFAULT_CUSTOMER.password,
        });
        const res = await api.post("/customer/login", {
            email:       DEFAULT_CUSTOMER.email,
            password:    DEFAULT_CUSTOMER.password,
            device_name: "stock-checker"
        });
        return res.data.token;
    }
};

const clearDefaultCart = async (token) => {
    try {
        await api.delete("/customer/cart/remove", {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch {
        // Panier déjà vide — ignorer
    }
};


const testQty = async (productId, qty, token) => {
    try {
        await clearDefaultCart(token);
        await api.post(
            `/customer/cart/add/${productId}`,
            { product_id: productId, quantity: qty, is_buy_now: 0 },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return true; // OK → quantité disponible
    } catch (error) {
        const msg = error.response?.data?.message ?? "";
        if (
            msg.includes("quantité demandée n'est pas disponible") ||
            msg.includes("requested quantity is not available")
        ) {
            return false; // Stock insuffisant
        }
        throw error; // Autre erreur
    }
};

export const getStockDisponible0 = async (productId) => {
    const token = await getDefaultCustomerToken();

    const hasStock = await testQty(productId, 1, token);
    if (!hasStock) {
        await clearDefaultCart(token);
        return 0;
    }

    // Vérifier si stock >= STOCK_MAX
    const maxAvailable = await testQty(productId, STOCK_MAX, token);
    if (maxAvailable) {
        await clearDefaultCart(token);
        return STOCK_MAX; // Stock >= 100, on retourne 100
    }

    // Binary search entre 1 et STOCK_MAX
    let low  = 1;
    let high = STOCK_MAX - 1;
    let stock = 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const ok  = await testQty(productId, mid, token);

        if (ok) {
            stock = mid;  // mid est disponible → chercher plus haut
            low   = mid + 1;
        } else {
            high  = mid - 1; // mid non disponible → chercher plus bas
        }
    }

    // Vider le panier final
    await clearDefaultCart(token);

    return stock;
};

export const getCategoriePending = async () => {
    const response = await getOrdersAdmin();
    // const listeCommande = response.data;
    // const commandes = [];
    // listeCommande.forEach((commande) => {
    //     if (commande.status === "pending") {
    //         commandes.push(
    //             commande
    //         );
    //     }
    // });
    // return commandes;
    return response.data.filter((commande) => commande.status === "pending");
};

export const getStockPending = async (productId) => {
    const commandesPending = await getCategoriePending();
    let stockPending = 0;
    commandesPending.forEach((commande) => {
        const items = commande.items;
        items.forEach((item)=>{
            if (item.product_id == productId) {
                stockPending+= item.qty_ordered
            }
        });
    });
    return stockPending;
};

export const getProductNonPromo = async () => {
    const response = await getProducts();
    const products = response.data;
    console.log(products);
    const retour = [];
    for (const product of products){
        if (product.special_price == null) {
            retour.push(product);
            console.log("Prix special null");
        }
    }
    return retour;
}


export const stockReel = async (productId) => {
    const stockDispo = await getStockDisponible(productId);
    const stockPending = await getStockPending(productId);
    const stockReel =  stockDispo + stockPending;
    return stockReel;
}

export const updateStock = async (productId, stockReel, stockPlus) => {
    const nouveauStock =Number(stockReel) + Number(stockPlus);
    return await updateProductStock(productId, nouveauStock);
}

export const getStockReel = async (productId) => {
    const res = await nodeApi.get(`/inventory/${productId}/reel`);
    return res.data.stock_reel;
};

export const getStockDisponible1 = async (productId) => {
    const res = await nodeApi.get(`/inventory/${productId}/disponible`);
    return res.data.stock_disponible;
};

export const getStockDetails = async (productId) => {
    const res = await nodeApi.get(`/inventory/${productId}`);
    return res.data;
};

export const getStockDisponible = async (productId) => {
    const res = await getProductByIdAdmin(productId);
    return res.data.inventory_indices[0].qty;
};