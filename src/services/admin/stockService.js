// src/services/admin/stockService.js
import api from "../../api/axios";

// ── Customer par défaut ───────────────────────────────────────────────
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
        // N'existe pas → créer
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

// ── Vider le panier ───────────────────────────────────────────────────
const clearDefaultCart = async (token) => {
    try {
        await api.delete("/customer/cart/remove", {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch {
        // Panier déjà vide — ignorer
    }
};

// ── Tester une quantité ───────────────────────────────────────────────
// Retourne true si la quantité est disponible, false sinon
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

// ── Binary Search ─────────────────────────────────────────────────────
export const getStockDisponible = async (productId) => {
    const token = await getDefaultCustomerToken();

    // Vérifier d'abord si stock = 0
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