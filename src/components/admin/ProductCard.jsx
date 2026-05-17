import "../../styles/product-card.css";
import { Link } from "react-router-dom";
function ProductCard({ product }) {
    return (
        <div className="product-card">
            <img
                src={product.base_image.medium_image_url}
                alt={product.name}
            />
            <h3>{product.name}</h3>
            <p>{product.formatted_price}</p>
            <Link to={`/admin/product-stock/${product.id}`}>
                    Details - Ajouter en stock
            </Link>
        </div>
    );
}
export default ProductCard;