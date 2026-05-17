import { useState } from "react";
import { updateStock } from "../../services/admin/stockService";

function AjouterStock({ productId, stockInitiale }) {
    const [quantity, setQuantity] = useState(1);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await updateStock(productId, stockInitiale, quantity);
            console.log(data);
            alert("Stock Update")
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
                Ajouter en stock
            </button>
        </form>
    );

}

export default AjouterStock;