import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
    getWishlist,
    moveWishlistToCart,
    toggleWishlist
} from "../services/wishlistService";

function Wishlist() {

    const [wishlist, setWishlist] = useState([]);
    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const data = await getWishlist();
            console.log(data);
            setWishlist(data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMoveToCart = async (wishlistId) => {

        try {
            await moveWishlistToCart(
                wishlistId
            );
            loadWishlist();

        } catch (error) {
            console.error(error);
            console.log(
                error.response.data
            );
        }

    };

    const handleRemove = async (productId) => {

        try {
            await toggleWishlist(
                productId
            );
            loadWishlist();
            
        } catch (error) {
            console.error(error);
        }
    };

    return (

        <MainLayout>
            <h1> Wishlist </h1>
            {
                wishlist.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            border:
                                "1px solid #ccc",
                            padding: "10px",
                            marginBottom: "10px"
                        }}
                    >
                        <img
                            src={
                                item.product
                                .base_image
                                .small_image_url
                            }
                            width="100"
                            alt={
                                item.product.name
                            }
                        />
                        <h3>
                            {
                                item.product.name
                            }
                        </h3>
                        <p>
                            {
                                item.product
                                .formatted_price
                            }
                        </p>

                        <button
                            onClick={() =>
                                handleMoveToCart(
                                    item.product.id
                                )
                            }
                        >
                            Ajouter Panier
                        </button>

                        <button
                            onClick={() =>
                                handleRemove(
                                    item.product.id
                                )
                            }
                        >
                            Supprimer
                        </button>

                    </div>

                ))
            }

        </MainLayout>

    );

}

export default Wishlist;