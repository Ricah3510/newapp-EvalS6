import { useEffect, useState } from "react";
import MainLayout from "../../layouts/admin/MainLayout";
import ProductCard from "../../components/admin/ProductCard";
import "../../styles/home.css";
import {getProducts} from "../../services/productService";
import { Link } from "react-router-dom";

function Stock() {
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
                <table border="1">
                    <thead>
                        <tr>
                            <th>ProduitId</th>
                            <th>Produit</th>
                            <th>En Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.inventories[0].qty}</td>
                                        <td><Link to={`/admin/product-stock/${product.id}`}>
                                                    Ajouter en stock
                                            </Link>
                                        </td>
                                    </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </MainLayout>
    );

}

export default Stock;