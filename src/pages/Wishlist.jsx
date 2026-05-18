import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
    getWishlist,
    moveWishlistToCart,
    toggleWishlist
} from "../services/wishlistService";
import "../styles/home.css";
import "../styles/wishlist.css";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading,  setLoading]  = useState(true);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        setLoading(true);
        try {
            const data = await getWishlist();
            setWishlist(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMoveToCart = async (productId) => {
        try {
            await moveWishlistToCart(productId);
            loadWishlist();
        } catch (error) {
            console.error(error);
            console.log(error.response?.data);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await toggleWishlist(productId);
            loadWishlist();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MainLayout>
            <div className="page">

                <h1 className="page-title">Ma Wishlist</h1>
                <p className="page-subtitle">
                    {loading ? "Chargement..." : `${wishlist.length} article(s)`}
                </p>
                <hr className="page-divider" />

                {loading && (
                    <div className="page-loading">
                        <div className="spinner" />
                        Chargement...
                    </div>
                )}

                {!loading && wishlist.length === 0 && (
                    <div className="wishlist-empty">
                        <span className="wishlist-empty-icon"></span>
                        <h2>Votre wishlist est vide</h2>
                        <p>Ajoutez des produits à votre liste de souhaits.</p>
                        <Link to="/" className="btn btn--accent">
                            Découvrir nos produits
                        </Link>
                    </div>
                )}

                {!loading && wishlist.length > 0 && (
                    <div className="wishlist-grid">
                        {wishlist.map((item) => (
                            <div key={item.id} className="wishlist-card">

                                <img
                                    src={item.product.base_image?.medium_image_url}
                                    alt={item.product.name}
                                />

                                {/* Infos */}
                                <div className="wishlist-card-body">
                                    <h3>{item.product.name}</h3>
                                    <p className="wishlist-card-price">
                                        {item.product.formatted_price}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="wishlist-card-actions">
                                    <button
                                        className="btn btn--accent"
                                        onClick={() => handleMoveToCart(item.product.id)}
                                    >
                                        + Panier
                                    </button>
                                    <button
                                        className="btn btn--danger"
                                        onClick={() => handleRemove(item.product.id)}
                                    >
                                        Retirer
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </MainLayout>
    );
}

export default Wishlist;
