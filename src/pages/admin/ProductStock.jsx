import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/admin/MainLayout";
import { getProductById } from "../../services/productService";
import AjouterStock from "../../components/admin/AjouterStock";
import "../../styles/admin.css";

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

            if (response.data.inventory_indices?.[0] && response.data.inventories?.[0]) {
                const dispo = response.data.inventory_indices[0].qty;
                const reel = response.data.inventories[0].qty;
                
                setStockDispo(dispo);
                setStockReel(reel);
                setStockPending(reel - dispo);
            } else {
                setStockDispo(0);
                setStockReel(0);
                setStockPending(0);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!product) {
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
                <h1 className="page-title">Gestion des Stocks</h1>
                <p className="page-subtitle">Ajustement des inventaires et suivi de disponibilité</p>
                <hr className="page-divider" />

                <div className="admin-product-layout">
                    
                    {/* COLONNE GAUCHE : Fiche Produit */}
                    <aside className="admin-product-card">
                        <h2 className="page-title" style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                            {product.name}
                        </h2>
                        <span style={{ fontSize: "0.8rem", color: "var(--clr-muted)" }}>ID: #{product.id}</span>
                        
                        <img
                            className="admin-product-img"
                            src={product.base_image?.large_image_url}
                            alt={product.name}
                        />
                        
                        <div className="admin-product-price">{product.formatted_price}</div>
                        
                        <div 
                            className="admin-product-description"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </aside>

                    {/* COLONNE DROITE : Espace de travail des Stocks */}
                    <main className="admin-stock-workspace">
                        
                        {/* 1. Compteurs visuels rapides */}
                        <div className="stock-counters-grid">
                            <div className="stock-card stock-card--reel">
                                <span className="label">Stock Réel</span>
                                <span className="value">{stockReel ?? "—"}</span>
                            </div>
                            <div className="stock-card stock-card--pending">
                                <span className="label">En attente</span>
                                <span className="value">{stockPending ?? "—"}</span>
                            </div>
                            <div className="stock-card stock-card--dispo">
                                <span className="label">Disponible</span>
                                <span className="value">{stockDispo ?? "—"}</span>
                            </div>
                        </div>

                        {/* 2. Formulaire d'ajustement */}
                        {stockReel !== null && (
                            <AjouterStock
                                productId={product.id}
                                stockInitiale={stockReel}
                            />
                        )}

                        {/* 3. Tableau détaillé */}
                        <div>
                            <h2 className="page-title" style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>
                                Détails du Registre
                            </h2>
                            <div className="admin-table-container" style={{ marginTop: 0 }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Type d'inventaire</th>
                                            <th style={{ textAlign: "right" }}>Quantité affectée</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="highlight">Stock Total Physique (Réel)</td>
                                            <td className="highlight" style={{ textAlign: "right" }}>{stockReel}</td>
                                        </tr>
                                        <tr>
                                            <td>Réservations (En attente de livraison)</td>
                                            <td style={{ textAlign: "right", color: "var(--clr-muted)" }}>{stockPending}</td>
                                        </tr>
                                        <tr>
                                            <td className="highlight" style={{ color: "#2E7D32" }}>Net Disponible (Vente en ligne)</td>
                                            <td className="highlight" style={{ textAlign: "right", color: "#2E7D32" }}>{stockDispo}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </MainLayout>
    );
}

export default ProductStock;