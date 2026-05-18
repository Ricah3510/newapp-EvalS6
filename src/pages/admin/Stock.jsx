import { useEffect, useState } from "react";
import MainLayout from "../../layouts/admin/MainLayout";
import { getProducts } from "../../services/productService";
import { Link } from "react-router-dom";
import "../../styles/admin.css";

function Stock() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
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
                <h1 className="page-title">Registre des Stocks</h1>
                <p className="page-subtitle">Vue globale des quantitatifs physiques disponibles sur le catalogue</p>
                <hr className="page-divider" />

                {loading ? (
                    <div className="page-loading">
                        <div className="spinner" />
                        Chargement du catalogue de stock...
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "100px" }}>ID</th>
                                    <th>Produit</th>
                                    <th style={{ width: "150px", textAlign: "center" }}>En Stock</th>
                                    <th style={{ width: "180px", textAlign: "right" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    // Sécurité au cas où l'inventaire n'est pas encore synchronisé
                                    const stockQty = product.inventories?.[0]?.qty ?? 0;
                                    const mainImage = product.base_image?.small_image_url || product.base_image?.large_image_url;

                                    return (
                                        <tr key={product.id}>
                                            <td className="highlight">#{product.id}</td>
                                            <td>
                                                <div className="admin-cell-product">
                                                    {mainImage && (
                                                        <img 
                                                            src={mainImage} 
                                                            alt={product.name} 
                                                            className="admin-table-thumb"
                                                        />
                                                    )}
                                                    <span className="highlight">{product.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <span className={`badge ${stockQty > 0 ? "badge--success" : "badge--pending"}`}>
                                                    {stockQty} unités
                                                </span>
                                            </td>
                                            <td style={{ textAlign: "right" }}>
                                                <Link 
                                                    to={`/admin/product-stock/${product.id}`}
                                                    className="btn-table-action"
                                                    style={{ textDecoration: "none", display: "inline-block" }}
                                                >
                                                    Gérer le stock
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default Stock;