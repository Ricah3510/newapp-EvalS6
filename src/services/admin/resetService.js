import apiAdmin from "../../api/axiosAdmin";
import nodeApi  from "../../api/axiosNode";

// ── Via Bagisto API ──────────────────────────────────────────────────

const getAllIds = async (endpoint) => {
    const res = await apiAdmin.get(endpoint, { params: { limit: 500 } });
    return res.data.data?.map((item) => item.id) ?? [];
};

const resetProducts = async () => {
    const ids = await getAllIds("/catalog/products");
    if (ids.length === 0) return;
    await apiAdmin.post("/catalog/products/mass-destroy", { indices: ids });
};

const resetCategories = async () => {
    const res        = await apiAdmin.get("/catalog/categories", { params: { limit: 500 } });
    const categories = res.data.data ?? [];
    
    // Garder id=1 (root) ET les catégories sans parent (niveau 1)
    const ids = categories
        .filter((c) => c.id !== 1 && c.parent_id !== null)
        .map((c) => c.id);
        
    console.log("Catégories à supprimer :", ids);
    
    if (ids.length === 0) return;
    await apiAdmin.post("/catalog/categories/mass-destroy", { indices: ids });
};

const resetCustomers = async () => {
    const ids = await getAllIds("/customers");
    if (ids.length === 0) return;
    await apiAdmin.post("/customers/mass-destroy", { indices: ids });
};

// ── Via Node API (tables sans endpoint Bagisto) ───────────────────────

const resetOrdersAndMore = async () => {
    await nodeApi.delete("/reset");
};

// ── Fonction principale ───────────────────────────────────────────────

export const resetAllData = async (onStep) => {

    onStep?.("Réinitialisation des commandes, paniers, wishlists...");
    await resetOrdersAndMore();

    onStep?.("Suppression des produits...");
    await resetProducts();

    onStep?.("Suppression des catégories...");
    await resetCategories();

    onStep?.("Suppression des clients...");
    await resetCustomers();

    onStep?.("Réinitialisation complète !");
};