import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import {
    getCart,
    updateCart,
    removeCartItem,
    clearCart
} from "../services/cartService";

function Panier() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const data = await getCart();
            setCart(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuantity = async (
        itemId,
        currentQty,
        action
    ) => {

        let newQty =
            action === "plus"
                ? currentQty + 1
                : currentQty - 1;

        if (newQty < 1) {
            return;
        }

        try {

            await updateCart({
                [itemId]: newQty
            });
            loadCart();

        } catch (error) {
            console.error(error);
        }

    };

    const handleRemove = async (itemId) => {
        try {
            await removeCartItem(itemId);
            loadCart();
        } catch (error) {
            console.error(error);
        }

    };

    const handleClearCart = async () => {
        try {
            await clearCart();
            loadCart();
        } catch (error) {
            console.error(error);
        }

    };

    if (!cart) {
        
        return(
            <MainLayout>
                <h1>Panier Vide - Chargement</h1>
            </MainLayout>
        );
    }

    return (

        <MainLayout>

            <h1>Mon Panier</h1>

            <button onClick={handleClearCart}>
                Vider panier
            </button>

            <hr />
            {
                cart.items.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginBottom: "10px"
                        }}
                    >

                        <img
                            src={
                                item.product.base_image
                                    .medium_image_url
                            }
                            width="120"
                        />

                        <h3>{item.name}</h3>

                        <p>
                            Prix :
                            {" "}
                            {item.formatted_price}
                        </p>

                        <div>

                            <button
                                onClick={() =>
                                    handleQuantity(
                                        item.id,
                                        item.quantity,
                                        "minus"
                                    )
                                }
                            >
                                -
                            </button>

                            <span
                                style={{
                                    margin: "0 10px"
                                }}
                            >
                                {item.quantity}
                            </span>

                            <button
                                onClick={() =>
                                    handleQuantity(
                                        item.id,
                                        item.quantity,
                                        "plus"
                                    )
                                }
                            >
                                +
                            </button>

                        </div>

                        <br />

                        <button
                            onClick={() =>
                                handleRemove(item.id)
                            }
                        >
                            Supprimer
                        </button>

                    </div>

                ))
            }

            <hr />

            <h2>
                Total :
                {" "}
                {cart.formatted_grand_total}
            </h2>
            <button
                onClick={() => navigate("/checkout")}
            >
                Valider panier
            </button>

        </MainLayout>

    );

}

export default Panier;