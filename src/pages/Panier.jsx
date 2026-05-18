import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useNavigate, Link } from "react-router-dom";
import {
    getCart,
    updateCart,
    removeCartItem,
    clearCart
} from "../services/cartService";
import "../styles/home.css";
import "../styles/panier.css";

function Panier() {
    const navigate = useNavigate();
    const [cart,    setCart]    = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const data = await getCart();
            setCart(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantity = async (itemId, currentQty, action) => {
        const newQty = action === "plus" ? currentQty + 1 : currentQty - 1;
        if (newQty < 1) return;
        try {
            await updateCart({ [itemId]: newQty });
            loadCart();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await removeCartItem(itemId);
            loadCart();
        } catch (error) {
            console.error(error);
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
            loadCart();
        } catch (error) {
            console.error(error);
        }
    };

    // ── Chargement ────────────────────────────────────────────
    if (loading) {
        return (
            <MainLayout>
                <div className="page">
                    <div className="page-loading">
                        <div className="spinner" />
                        Chargement du panier...
                    </div>
                </div>
            </MainLayout>
        );
    }

    // ── Panier vide ───────────────────────────────────────────
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <MainLayout>
                <div className="page">
                    <div className="panier-empty">
                        <span className="panier-empty-icon">🛒</span>
                        <h2>Votre panier est vide</h2>
                        <p>Découvrez nos produits et ajoutez-en à votre panier.</p>
                        <Link to="/" className="btn btn--accent">
                            Continuer mes achats
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="page">

                {/* Titre */}
                <div className="panier-header">
                    <div>
                        <h1 className="page-title">Mon Panier</h1>
                        <p className="page-subtitle">
                            {cart.items_qty} article(s)
                        </p>
                    </div>
                    <button
                        className="btn btn--danger"
                        onClick={handleClearCart}
                    >
                        Vider le panier
                    </button>
                </div>

                <hr className="page-divider" />

                <div className="panier-layout">

                    {/* ── Liste articles ── */}
                    <div>
                        {cart.items.map((item) => (
                            <div key={item.id} className="panier-item">

                                {/* Image */}
                                <img
                                    src={item.product.base_image?.medium_image_url}
                                    alt={item.name}
                                />

                                {/* Info */}
                                <div className="panier-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="panier-item-price">
                                        {item.formatted_price}
                                    </p>

                                    {/* Quantité */}
                                    <div className="qty-control">
                                        <button
                                            className="qty-btn"
                                            disabled={item.quantity <= 1}
                                            onClick={() => handleQuantity(item.id, item.quantity, "minus")}
                                        >
                                            −
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => handleQuantity(item.id, item.quantity, "plus")}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Supprimer */}
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Supprimer
                                    </button>
                                </div>

                                {/* Total ligne */}
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <p style={{
                                        fontWeight: 700,
                                        fontSize:   "1rem",
                                        color:      "var(--clr-charcoal)"
                                    }}>
                                        {item.formatted_total}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* ── Récap ── */}
                    <div className="panier-summary">
                        <h2>Récapitulatif</h2>

                        <div className="panier-summary-row">
                            <span>Sous-total</span>
                            <span>{cart.formatted_sub_total}</span>
                        </div>

                        <div className="panier-summary-row">
                            <span>Livraison</span>
                            <span>Gratuite</span>
                        </div>

                        {cart.discount_amount > 0 && (
                            <div className="panier-summary-row">
                                <span>Remise</span>
                                <span>− {cart.formatted_discount}</span>
                            </div>
                        )}

                        <div className="panier-summary-row total">
                            <span>Total</span>
                            <span>{cart.formatted_grand_total}</span>
                        </div>

                        <button
                            className="btn btn--accent"
                            style={{ width: "100%", marginTop: "0.5rem" }}
                            onClick={() => navigate("/checkout")}
                        >
                            Commander →
                        </button>

                        <Link
                            to="/"
                            className="btn"
                            style={{ width: "100%", textAlign: "center", textDecoration: "none" }}
                        >
                            Continuer mes achats
                        </Link>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}

export default Panier;
