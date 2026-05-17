import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/admin/MainLayout";
import { getProductById } from "../../services/productService";
import { getStockDisponible, getStockPending } from "../../services/admin/stockService";
import AjouterStock from "../../components/admin/AjouterStock";
function ProductStock() {
    const [product, setProduct] = useState(null);
    const { id } = useParams();
    const [stockDispo, setStockDispo] = useState(null);
    const [stockPending, setStockPending] = useState(null);
    const [stockReel, setStockReel] = useState(null);
    useEffect(() => {
        loadProduct();
    }, [id]);
    const loadProduct = async () => {
        try {
            const response = await getProductById(id);
            setProduct(response.data);

            const qty = await getStockDisponible(response.data.id);
            setStockDispo(qty);
            console.log("Stock dispo pour client fini");
            const qtyPending = await getStockPending(response.data.id);
            setStockPending(qtyPending);
            console.log("Stock en attente de livraison fini");

            setStockReel( qty + qtyPending );
        } catch (error) {
            console.error(error);
        }
    };
    if (!product) {
        return (
            <MainLayout>
                <h1>Chargement...</h1>
            </MainLayout>
        );
    }
    return (
        <MainLayout>
            <div>
                <h1>{product.name} - {product.id} </h1>
                <img
                    src={product.base_image.large_image_url}
                    alt={product.name}
                    width="300"
                />
                <p>{product.formatted_price}</p>
                <div
                    dangerouslySetInnerHTML={{
                        __html: product.description
                    }}
                />
                <p>
                    Stock disponible :
                    {
                        stockDispo === null
                        ? "Chargement..."
                        : stockDispo
                    }
                </p>

                <p>
                    Stock en attente de livraison :
                    {
                        stockPending === null
                        ? "Chargement..."
                        : stockPending
                    }
                </p>

                <p>
                    Stock Reel :
                    {
                        stockReel === null
                        ? "Chargement..."
                        : stockReel
                    }
                </p>

                {
                    stockReel !== null && (

                        <AjouterStock
                            productId={product.id}
                            stockInitiale={stockReel}
                        />

                    )
                }
            </div>
            <div>
                <h1>Details Stock</h1>
                <table border="1">
                <thead>
                    <tr>
                        <th>Stock Reel</th>
                        <th>En attente de livraison</th>
                        <th>Disponible pour Client</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>{stockReel}</th>
                        <th>{stockPending}</th>
                        <th>{stockDispo}</th>
                    </tr>
                </tbody>
                </table>
            </div>
        </MainLayout>

    );

}

export default ProductStock;