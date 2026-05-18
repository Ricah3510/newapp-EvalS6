import { createContext, useContext, useEffect, useState } from "react";
import { getWishlist } from "../services/wishlistService";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistIds, setWishlistIds] = useState([]);

    const loadWishlist = async () => {
        try {
            const data = await getWishlist();
            const ids  = data.data.map((item) => item.product.id);
            setWishlistIds(ids);
        } catch {
            setWishlistIds([]);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, []);

    const toggle = (productId) => {
        setWishlistIds((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <WishlistContext.Provider value={{ wishlistIds, toggle, loadWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);