import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import { getProductsByCategory, getProducts } from "../services/productService";
import "../styles/home.css";
import AddToCartForm from "../components/AddToCartForm";
function Product() {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("category_id");

    useEffect(() => {
        loadProducts();
    }, [categoryId]);

    const loadProducts = async () => {
        try {
            const data = await getProductsByCategory(categoryId);
            setProducts(data.data);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <MainLayout>
            <h1>Liste Produits</h1>
            <div className="products-grid">
                {
                    products.map((product) => (
                        <div key={product.id}>
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                            <AddToCartForm productId={product.id} />
                        </div>
                        
                    ))
                }
            </div>
        </MainLayout>
    );

}

export default Product;