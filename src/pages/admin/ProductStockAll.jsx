import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/admin/MainLayout";
import { getProductNonPromo } from "../../services/admin/stockService";
import AjouterStock from "../../components/admin/AjouterStock";
import "../../styles/admin.css";
import { updateStock } from "../../services/admin/stockService";

function ProductStockAll() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        loadProduct();
    }, []);
    const loadProduct = async () => {
        try {
            const response = await getProductNonPromo();
            setProducts(response);
            console.log (response);
        } catch (error) {
            console.error(error);
        }
    };
    const [nbLigne, setNbLigne] = useState(5);
    // const [items, setItems] = useState(
    //     Array.from(
    //         { length: nbLigne },
    //         () => ({
    //             productId: "",
    //             qty: ""
    //         })
    //     )
    // );
    const [items, setItems] = useState(
            Array.from(
            { length: 5 },
            () => ({
                productId: "",
                qty: ""
            })
        )
    );

    const loadLignes = (nombreLigne) => {
        const lignes = Array.from(
            { length: nombreLigne },
            () => ({
                productId: "",
                qty: ""
            })
        )
        setItems(lignes);
    }
    const handleSubmitLigne = async (e) => {
        e.preventDefault();
        loadLignes(nbLigne)
    }
    const handleChange = ( index, field, value ) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
        console.log("Ligne : " + index + ", colonne: " + field + ", valeur: " + value );
    };
    const verification = () => {
        const newItems = items.map(item => ({ ...item }));
        for (let i = 0; i < newItems.length; i++) {
            const ligne = newItems[i];
            if (ligne.productId === "") continue;
    
            let qtyfinal = Number(ligne.qty);
    
            for (let j = i + 1; j < newItems.length; j++) {
                const element = newItems[j];
                if (element.productId === ligne.productId) {
                    qtyfinal += Number(element.qty);
                    newItems[j]["productId"] = "";
                    newItems[j]["qty"]       = "";
                }
            }
            newItems[i]["qty"] = qtyfinal;
        }
    
        setItems(newItems);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Ajout au stock ", items);
        verification()
        for (let index = 0; index < items.length; index++) {
            const ligne = items[index];
            if (ligne.productId != "" && Number(ligne.qty) >= 1 ) {
                try {
                    const product_ligne = products.find( (product) => product.id == ligne.productId );
                    console.log(product_ligne);
                    const data = await updateStock(ligne.productId, product_ligne.inventories[0].qty, ligne.qty);
                    console.log(data);
                    loadProduct();
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };
    const addItem = () => {
        setItems([ ...items,
            {
                nom: "",
                prix: ""
            }
        ]);
        setNbLigne(nbLigne + 1);
    };
    const deleteItem = (id) => {
        console.log("Ligne a supprimer " + id);
        console.log("items depart ", items);
        const newItems = [];
        let count = 0;
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            if (index != id) {
                newItems[count] = element;
                count++;
            }
        }
        console.log("Items new", newItems);
        setItems(newItems);
        setNbLigne(nbLigne - 1);
    };
    if (!products) {
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
                <h1 className="page-title">Eval 1- Alea</h1>
                <p className="page-subtitle">Ajustement des inventaires et suivi de disponibilité</p>
                <hr className="page-divider" />
                {/* <form onSubmit={handleSubmitLigne}>
                    <p>Nombre de Ligne</p>
                    <input
                            type="number"
                            min="1"
                            value={nbLigne}
                            onChange={(e) => setNbLigne(parseInt(e.target.value))}
                    />
                    <button type="submit">
                    Valider
                    </button>   
                </form> */}
                <hr />
                <form onSubmit={handleSubmit}>
                {
                    items.map( (item, index) => (
                        <div key={index}>
                            <select value={item.productId}
                                onChange={(e) => handleChange(index,"productId",e.target.value) }
                            >
                                <option value=""> Produits </option>
                                {
                                    products.map((product)=>(
                                        <option key={product.id} value={product.id}> {product.name} </option>
                                    ))
                                }
                            </select>
                            <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) => handleChange(index,"qty",e.target.value) || 1}
                            />
                            {/* <button
                                type="button"
                                onClick={() => deleteItem(index)}
                                >
                                Supprimer ligne
                            </button> */}
                        </div>
                    ))
                }
                <button type="submit">
                    Envoyer
                </button>

            </form>
            {/* <button
                type="button"
                onClick={addItem}
                >
                Ajouter ligne
            </button> */}
            </div>
        </MainLayout>
    );
}

export default ProductStockAll;