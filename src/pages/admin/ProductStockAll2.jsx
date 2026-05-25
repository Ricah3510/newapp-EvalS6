import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/admin/MainLayout";
import { getProductNonPromo } from "../../services/admin/stockService";
import AjouterStock from "../../components/admin/AjouterStock";
import "../../styles/admin.css";
import { updateStock } from "../../services/admin/stockService";

function ProductStockAll2() {
    const [qty, setQty] = useState(1);
    const [products, setProducts] = useState([]);
    useEffect(() => {
        loadProduct();
    }, []);
    const loadProduct = async () => {
        try {
            const response = await getProductNonPromo();
            setProducts(response);
            console.log (response);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const selectedProducts = formData.getAll("products");
        console.log( selectedProducts);
        console.log("Qty: " + qty);
        for (let index = 0; index < selectedProducts.length; index++) {
            try {
                const productId = selectedProducts[index];
                console.log("ProductId " + productId);
                const product = products.find( (product) => product.id == productId );
                console.log(product);
                const data = await updateStock(productId, product.inventories[0].qty, qty);
                console.log(data);
                loadProduct();
                e.target.reset();
                setQty(1);
            } catch (error) {
                console.error(error);
                
            }
        }
        };

    if (!products) {
        return (
            <MainLayout>
                <div className="page">
                    <div className="page-loading">
                        <div className="spinner" />
                        Chargement des informations du produit...
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="page">
            <h1 className="page-title">Eval 1- Alea - 2 </h1>
                <p className="page-subtitle">Ajpouter en Stock - CheckBox</p>
                <hr className="page-divider" />
                <form onSubmit={handleSubmit}>
                {
                    products.map((product) => (
                        <label key={product.id}>
                            <p>
                            <input
                                type="checkbox"
                                name="products"
                                value={product.id}
                            />
                            {product.name}
                            </p>
                        </label>
                    ))
                }
                 <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                />
                <button type="submit">
                    Envoyer
                </button>

            </form>
            </div>
        </MainLayout>
    );
}

export default ProductStockAll2;