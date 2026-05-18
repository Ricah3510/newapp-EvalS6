import "../styles/product-card.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toggleWishlist } from "../services/wishlistService";
import {
    FaHeart,
    FaRegHeart
} from "react-icons/fa";
function ProductCard({ product }) {
    const [isWishlist, setIsWishlist] = useState(product.is_saved);
    const handleWishlist = async () => {
        try {
            await toggleWishlist(
                product.id
            );
            setIsWishlist( !isWishlist);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="product-card">
                    <button
            onClick={handleWishlist}
        >
            {
                isWishlist
                ? <FaHeart />
                : <FaRegHeart />
            }
        </button>
            <img
                src={product.base_image.medium_image_url}
                alt={product.name}
            />
            <h3>{product.name}</h3>
            <p>{product.formatted_price}</p>
            <Link to={`/product-fiche/${product.id}`}>
                    Voir plus de details
            </Link>
        </div>
    );
}
export default ProductCard;