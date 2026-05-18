import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import MainLayout from "../layouts/MainLayout";
import "../styles/home.css";
import { Link } from "react-router-dom";

function Home() {
    const [categories, setCategories] = useState([]);
    const [links,      setLinks]      = useState({});
    const [loading,    setLoading]    = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async (url = null) => {
        setLoading(true);
        try {
            const data = await getCategories(url);
            setCategories(data.data);
            setLinks(data.links);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="page">

                <h1 className="page-title">Nos Catégories</h1>
                <p className="page-subtitle">Explorez notre sélection</p>
                <hr className="page-divider" />

                {loading && (
                    <div className="categories-grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton skeleton-card" />
                        ))}
                    </div>
                )}

                {!loading && (
                    <div className="categories-grid">
                        {categories
                        .filter((category) => category.id !== 1)
                        .map((category) => (
                            <Link
                                key={category.id}
                                to={`/products?category_id=${category.id}`}
                                className="category-card"
                            >
                                {category.name}
                                <span>{category.children?.length > 0
                                    ? `${category.children.length} sous-catégorie(s)`
                                    : "Voir les produits"
                                }</span>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="pagination">
                    {links.prev && (
                        <button
                            className="btn"
                            onClick={() => loadCategories(links.prev)}
                        >
                            ← Précédent
                        </button>
                    )}
                    {links.next && (
                        <button
                            className="btn btn--accent"
                            onClick={() => loadCategories(links.next)}
                        >
                            Suivant →
                        </button>
                    )}
                </div>

            </div>
        </MainLayout>
    );
}

export default Home;
