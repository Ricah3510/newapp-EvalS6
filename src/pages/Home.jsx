import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import MainLayout from "../layouts/MainLayout";
import "../styles/home.css";
import { Link } from "react-router-dom";
function Home() {

    const [categories, setCategories] = useState([]);
    const [links, setLinks] = useState({});
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async (url = null) => {
        try {
            const data = await getCategories(url);
            setCategories(data.data);
            setLinks(data.links);
        } catch (error) {
            console.error(error);
        }

    };

    return (
        <MainLayout>
            <h1>Liste Categories</h1>
            <div>
            {
                categories.map((category) => (
                    <h3 key={category.id}>
                    <Link to={`/products?category_id=${category.id}`}>
                    {category.id} - {category.name}
                    </Link>
                </h3>
                ))
            }
            </div>
            <div style={{
                marginTop: "20px",
                display: "flex",
                gap: "50px"
            }}>

                {
                    links.prev && (
                        <button onClick={() => loadCategories(links.prev)}>
                            Precedent
                        </button>
                    )
                }

                {
                    links.next && (
                        <button onClick={() => loadCategories(links.next)}>
                            Plus
                        </button>
                    )
                }

            </div>
        </MainLayout>
    );
}

export default Home;