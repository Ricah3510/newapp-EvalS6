import { createBrowserRouter } from "react-router-dom";

import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Orders from "../pages/Orders";
import Panier from "../pages/Panier";
import Product from "../pages/Product";
import ProductFiche from "../pages/ProductFiche";
import AdminLogin from "../pages/admin/AdminLogin";
import ImportFile from "../pages/admin/ImportFile";
import ResetData from "../pages/admin/ResetData";
import Admin from "../pages/admin/Admin";
import AdminRoute from "./AdminRoute";
import AdminOrders from "../pages/admin/AdminOrders";
import Wishlist from "../pages/Wishlist";
import ImportImages from "../pages/admin/ImportImage";
const router = createBrowserRouter([

    {
        path: "/",
        element: <Home />,
    },

    {
        path: "/products",
        element: <Product />,
    },

    {
        path: "/product-fiche/:id",
        element: <ProductFiche />,
    },

    {
        path: "/login",
        element: <Login />,
    },

    {
        path: "/panier",
        element: <Panier />,
    },

    {
        path: "/checkout",
        element: <Checkout />,
    },

    {
        path: "/orders",
        element: <Orders />
    },

    {
        path: "/wishlist",
    
        element: <Wishlist />
    },

    
    //Admin
    {
        path: "/admin-login",
        element: <AdminLogin />
    },

    {
        path: "/admin",
        element:(
            <AdminRoute>
                <Admin />
            </AdminRoute>
        )
    },

    {
        path: "/admin/reset-data",
        element:(
            <AdminRoute>
                <ResetData />
            </AdminRoute>
        )
    },

    {
        path: "/admin/import-file",
        element:(
            <AdminRoute>
                <ImportFile />
            </AdminRoute>
        )
    },

    {
        path: "/admin/orders",
    
        element: (
            <AdminRoute>
                <AdminOrders />
            </AdminRoute>
        )
    },

    {
        path: "/admin/import-image",
    
        element: (
            <AdminRoute>
                <ImportImages />
            </AdminRoute>
        )
    },
]);

export default router;