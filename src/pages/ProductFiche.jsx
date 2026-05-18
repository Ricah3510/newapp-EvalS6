import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProductById } from "../services/productService";
import AddToCartForm from "../components/AddToCartForm";
import { getStockDisponible } from "../services/admin/stockService";
function ProductFiche() {
    const [product, setProduct] = useState(null);
    const { id } = useParams();
    const [stock, setStock] = useState(null);
    useEffect(() => {
        loadProduct();
    }, [id]);
    const loadProduct = async () => {
        try {
            const data = await getProductById(id);
            setProduct(data.data);

            const qty = await getStockDisponible(id);
            setStock(qty);
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
            <p>Stock disponible : {stock === null ? "Chargement..." : stock}</p>
            <AddToCartForm productId={product.id} />
        </MainLayout>

    );

}

export default ProductFiche;