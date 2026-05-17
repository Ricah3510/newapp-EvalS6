import { useEffect, useState } from "react";
import MainLayout from "../../layouts/admin/MainLayout";
import ProductCard from "../../components/admin/ProductCard";
import "../../styles/home.css";
import {getProducts} from "../../services/productService";

function ProductAdmin() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
            loadProducts();

    },[]);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
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
                            <ProductCard product={product}
                            />
                        </div>
                        
                    ))
                }
            </div>
        </MainLayout>
    );

}

export default ProductAdmin;