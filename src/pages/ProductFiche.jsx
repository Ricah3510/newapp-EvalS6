import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getProductById } from "../services/productService";
import AddToCartForm from "../components/AddToCartForm";
import "../styles/home.css";
import "../styles/product-card.css";
import "../styles/product-fiche.css";

function ProductFiche() {
    const [product, setProduct] = useState(null);
    const [stock,   setStock]   = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        setLoading(true);
        try {
            const data = await getProductById(id);
            setProduct(data.data);
            setStock(data.data.inventory_indices?.[0]?.qty ?? 0);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStockClass = () => {
        if (stock === null) return "loading";
        if (stock === 0)    return "out-stock";
        if (stock <= 5)     return "low-stock";
        return "in-stock";
    };

    const getStockLabel = () => {
        if (stock === null) return "Calcul en cours...";
        if (stock === 0)    return "Rupture de stock";
        if (stock <= 5)     return `Plus que ${stock} en stock`;
        if (stock >= 100)   return "En stock (100+)";
        return `${stock} disponible(s)`;
    };

    if (loading || !product) {
        return (
            <MainLayout>
                <div className="page">
                    <div className="page-loading">
                        <div className="spinner" />
                        Chargement du produit...
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="page">

                <nav className="fiche-breadcrumb">
                    <Link to="/">Accueil</Link>
                    <span>/</span>
                    <Link to={`/products?category_id=${product.categories[0].id}`}>Produits</Link>
                    <span>/</span>
                    <span style={{ color: "var(--clr-charcoal)" }}>
                        {product.name}
                    </span>
                </nav>

                <div className="fiche-layout">

                    <div className="fiche-image-wrap">
                        <img
                            src={product.base_image?.large_image_url}
                            alt={product.name}
                        />
                    </div>

                    <div className="fiche-info">

                        <div>
                            <p className="fiche-id">REF : {product.sku}</p>
                            <h1>{product.name}</h1>
                        </div>

                        <p className="fiche-price">
                            {product.formatted_price}
                            {console.log(product.regular_price)}
                        </p>
                        {
                            product.regular_price ?(
                                product.regular_price != product.price ? ( <p>EN PROMO </p>
                                ) : (
                                    <p>Prix Normal</p>
                                )
                            ) : ( console.log ("prix noraml"))
                            
                        }

                        <hr className="fiche-divider" />

                        <div className="fiche-stock">
                            <span className={`stock-dot ${getStockClass()}`} />
                            {getStockLabel()}
                        </div>

                        <hr className="fiche-divider" />

                        <div
                            className="fiche-description"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />

                        <hr className="fiche-divider" />

                        <div className="fiche-add-to-cart">
                            <AddToCartForm productId={product.id} />
                        </div>

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default ProductFiche;
