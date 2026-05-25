import "../styles/product-card.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toggleWishlist } from "../services/wishlistService";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";

function ProductCardPromo({ product }) {
    const { wishlistIds, toggle } = useWishlist();
    const [loading, setLoading]   = useState(false);

    const isWishlist = wishlistIds.includes(product.id);

    const handleWishlist = async () => {
        setLoading(true);
        try {
            await toggleWishlist(product.id);
            toggle(product.id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Calcul pourcentage de réduction
    const regular  = parseFloat(product.regular_price);
    const special  = parseFloat(product.special_price);
    const discount = regular && special
        ? Math.round(((regular - special) / regular) * 100)
        : null;

    return (
        <>
            {discount && (
                <div className="promo-badge">
                    -{discount}%
                </div>
            )}

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

                <div className="product-card-prices">
                    <p className="product-card-price-old">
                        {product.formatted_regular_price}
                    </p>
                    <p className="product-card-price promo">
                        {product.formatted_special_price}
                    </p>
                </div>

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

export default ProductCardPromo;