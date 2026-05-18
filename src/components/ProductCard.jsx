import "../styles/product-card.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toggleWishlist } from "../services/wishlistService";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({ product }) {
    const { wishlistIds, toggle } = useWishlist();
    const [loading, setLoading]   = useState(false);

    // ← vérification depuis le contexte global
    const isWishlist = wishlistIds.includes(product.id);

    const handleWishlist = async () => {
        setLoading(true);
        try {
            await toggleWishlist(product.id);
            toggle(product.id); // ← met à jour le contexte
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className={`wishlist-btn ${isWishlist ? "active" : ""}`}
                onClick={handleWishlist}
                disabled={loading}
                title={isWishlist ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
            >
                {isWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>

            <img
                src={product.base_image?.medium_image_url}
                alt={product.name}
            />

            <div className="product-card-body">
                <h3>{product.name}</h3>
                <p className="product-card-price">{product.formatted_price}</p>
                <Link
                    to={`/product-fiche/${product.id}`}
                    className="product-card-link"
                >
                    Voir les détails →
                </Link>
            </div>
        </>
    );
}

export default ProductCard;
