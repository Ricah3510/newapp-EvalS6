import { useState } from "react";
import { updateStock } from "../../services/admin/stockService";

function AjouterStock({ productId, stockInitiale }) {
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const data = await updateStock(productId, stockInitiale, quantity);
            console.log(data);

            alert("Le stock a été mis à jour avec succès !");
            
            setQuantity(1); 
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-stock-form-box">
            <h3>Ajuster les quantités physiques</h3>
            
            <form onSubmit={handleSubmit} className="admin-input-group">
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    disabled={isSubmitting}
                />
                
                <button
                    type="submit"
                    className="btn btn--accent"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Mise à jour..." : "Ajouter au stock"}
                </button>
            </form>
        </div>
    );
}

export default AjouterStock;