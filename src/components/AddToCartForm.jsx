import { useState } from "react";
import { addToCart } from "../services/cartService";

function AddToCartForm({ productId }) {
    const [quantity, setQuantity] = useState(1);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await addToCart(
                productId,
                quantity
            );
            console.log(data);
            alert("Produit ajouté")
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                    setQuantity(e.target.value)
                }
            />
            <button type="submit">
                Ajouter au panier
            </button>
        </form>
    );

}

export default AddToCartForm;