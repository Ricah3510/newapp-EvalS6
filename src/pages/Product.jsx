import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProductCard from "../components/ProductCard";
import { getProductsByCategory } from "../services/productService";
import "../styles/home.css";
import "../styles/product-card.css";
import AddToCartForm from "../components/AddToCartForm";

function Product() {
    const [products, setProducts] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("category_id");

    useEffect(() => {
        loadProducts();
    }, [categoryId]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getProductsByCategory(categoryId);
            setProducts(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="page">

                <h1 className="page-title">Produits</h1>
                <p className="page-subtitle">
                    {loading ? "Chargement..." : `${products.length} produit(s) disponible(s)`}
                </p>
                <hr className="page-divider" />

                {/* Skeleton loading */}
                {loading && (
                    <div className="products-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton skeleton-product" />
                        ))}
                    </div>
                )}

                {/* Grille produits */}
                {!loading && products.length === 0 && (
                    <div className="page-loading">
                        <p>Aucun produit dans cette catégorie.</p>
                    </div>
                )}

                {!loading && products.length > 0 && (
                    <div className="products-grid">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">
                                <ProductCard product={product} />
                                <AddToCartForm productId={product.id} />
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </MainLayout>
    );
}

export default Product;
