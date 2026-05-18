import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from "./routes/router";
import { RouterProvider } from "react-router-dom";
import "./styles/global.css";
import { WishlistProvider } from "./context/WishlistContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WishlistProvider>
      <RouterProvider router={router} />
    </WishlistProvider>
  </StrictMode>,
)