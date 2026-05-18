import { useState } from "react";
import { addToCart } from "../services/cartService";
import "../styles/product-card.css";

function AddToCartForm({ productId }) {
    const [quantity, setQuantity] = useState(1);
    const [loading,  setLoading]  = useState(false);
    const [added,    setAdded]    = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addToCart(productId, quantity);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="add-to-cart-form" onSubmit={handleSubmit}>
            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button
                type="submit"
                className="add-to-cart-btn"
                disabled={loading}
            >
                {loading ? "..." : added ? "✓ Ajouté" : "Ajouter"}
            </button>
        </form>
    );
}

export default AddToCartForm;
