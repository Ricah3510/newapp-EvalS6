import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProductById } from "../services/productService";
import { getStockDisponible } from "../services/admin/stockService";
import AddToCartForm from "../components/AddToCartForm";

function ProductFiche() {
    const [product, setProduct] = useState(null);
    const [stock,   setStock]   = useState(null);
    const { id } = useParams();

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct(data.data);
            console.log(data);
            // const qty = await getStockDisponible(data.data.id);
            setStock(data.data.inventory_indices[0].qty);

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
            <h1>{product.name} - {product.id}</h1>

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
                Stock disponible :{" "}
                {stock === null
                    ? "Calcul en cours..."
                    : stock === 100
                    ? "100+"
                    : stock === 0
                    ? "Rupture de stock"
                    : stock
                }
            </p>

            <AddToCartForm productId={product.id} />

        </MainLayout>
    );
}

export default ProductFiche;