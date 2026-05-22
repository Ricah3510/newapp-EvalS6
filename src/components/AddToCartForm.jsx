import { useState } from "react";
import { addToCart } from "../services/cartService";
import "../styles/product-card.css";

function AddToCartForm({ productId }) {
    const [quantity, setQuantity] = useState(1);
    const [loading,  setLoading]  = useState(false);
    const [added,    setAdded]    = useState(false);
    const [error,    setError]    = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await addToCart(productId, quantity);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (error) {
            // console.error(error);
            const msg = error.response?.data?.message ?? "Une erreur est survenue.";
            setError(msg);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
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

            {error && (
                <div style={{
                    marginTop:    "0.5rem",
                    padding:      "0.5rem 0.875rem",
                    background:   "#FEE2E2",
                    border:       "1.5px solid #C0392B",
                    borderRadius: "var(--radius)",
                    color:        "#991B1B",
                    fontSize:     "0.8rem",
                    fontWeight:   "500",
                    animation:    "toast-in 0.2s ease"
                }}>
                    {error}
                </div>
            )}
        </div>
    );
}

export default AddToCartForm;
