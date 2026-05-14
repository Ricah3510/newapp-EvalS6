import { useState } from "react";
import MainLayout from "../../layouts/admin/MainLayout";
import {
    registerCustomer,
    getCategories,
    createCategory,
    createProductSkeleton,
    updateProductDetails,
    updateProductStock,
} from "../../services/admin/importService";
function ImportFile() {

    const [customerFile, setCustomerFile] = useState(null);

    const [productFile, setProductFile] = useState(null);

    const handleCustomerFile = (e) => {
        setCustomerFile(
            e.target.files[0]
        );
    };

    const importCustomers = async () => {
        if (!customerFile) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split("\n");
            const customers =
                lines
                .slice(1)
                .filter((line) => line.trim() !== "")
                .map((line) => {
                    const [
                        nom,
                        prenom,
                        email,
                        pwd
                    ] = line.split(",");

                    return {
                        first_name: prenom.trim(),
                        last_name: nom.trim(),
                        email:email.trim(),
                        password: pwd.trim(),
                        password_confirmation:pwd.trim()
                    };
                });
            console.log(customers);
            for (const customer of customers) {
                try {
                    const data = await registerCustomer(customer);
                    console.log( "SUCCESS", data );
                } catch (error) {
                    console.log( "ERROR",customer.email );
                    console.log( error.response.data );
                }
            }
        };
        reader.readAsText(customerFile);
    };


    const toUrlKey = (name) =>
    name.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");

    const categoryCache = {};

    const getOrCreateCategory = async (categoryName) => {
        if (categoryCache[categoryName]) return categoryCache[categoryName];

        const res      = await getCategories();
        const existing = res.data?.find(
            (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (existing) {
            categoryCache[categoryName] = existing.id;
            return existing.id;
        }

        const formData = new FormData();
        formData.append("locale",        "fr");
        formData.append("name",          categoryName);
        formData.append("slug",          toUrlKey(categoryName));
        formData.append("status",        "1");
        formData.append("position",      "1");
        formData.append("display_mode",  "products_and_description");
        formData.append("description",   categoryName);
        formData.append("parent_id",     "1");
        formData.append("attributes[]",  "9");

        const created = await createCategory(formData);
        categoryCache[categoryName] = created.data.id;
        return created.data.id;
    };

    const importProducts = async () => {
        if (!productFile) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const lines = e.target.result.split("\n");
            const rows  = lines
                .slice(1)
                .filter((line) => line.trim() !== "")
                .map((line) => {
                    const [type, sku, name, Categorie, prix_vente, prix_achat, prix_promo, stock_initial] =
                        line.split(",");
                    return {
                        type:          type?.trim() || "simple",
                        sku:           sku?.trim(),
                        name:          name?.trim(),
                        Categorie:     Categorie?.trim(),
                        prix_vente:    prix_vente?.trim(),
                        prix_achat:    prix_achat?.trim(),
                        prix_promo:    prix_promo?.trim(),
                        stock_initial: stock_initial?.trim(),
                    };
                });

            for (const row of rows) {
                try {
                    // Catégorie
                    const categoryId = await getOrCreateCategory(row.Categorie);

                    // Squelette produit
                    const product   = await createProductSkeleton(row.type, row.sku);
                    const productId = product.data.id;

                    // Détails
                    const formData = new FormData();
                    formData.append("_method",              "PUT");
                    formData.append("channel",              "default");
                    formData.append("locale",               "fr");
                    formData.append("sku",                  row.sku);
                    formData.append("name",                 row.name);
                    formData.append("url_key",              toUrlKey(row.name));
                    formData.append("short_description",    row.name);
                    formData.append("description",          row.name);
                    formData.append("price",                row.prix_vente);
                    formData.append("cost",                 row.prix_achat);
                    formData.append("status",               "1");
                    formData.append("visible_individually", "1");
                    formData.append("guest_checkout",       "1");
                    formData.append("manage_stock",         "1");
                    formData.append("categories[]",         categoryId);
                    formData.append("channels[]",           "1");
                    formData.append("weight", "200");
                    if (row.prix_promo && row.prix_promo !== "") {
                        formData.append("special_price", row.prix_promo);
                    }
                    await updateProductDetails(productId, formData);

                    // Stock
                    await updateProductStock(productId, parseInt(row.stock_initial) || 0);

                    console.log("SUCCESS", row.sku);
                } catch (error) {
                    console.log("ERROR", row.sku);
                    console.log(error.response?.data);
                }
            }
        };
        reader.readAsText(productFile);
    };
    return (
        <MainLayout>
            <div>
                <h1>
                    Import de fichier
                </h1>
                <hr />

                <h2>
                    Import Customers
                </h2>
                <input
                    type="file"
                    accept=".csv"
                    onChange={
                        handleCustomerFile
                    }
                />

                <br />
                <button
                    onClick={
                        importCustomers
                    }
                >
                    Import Customers
                </button>
                <hr />

                <h2>Import Produits</h2>
                <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setProductFile(e.target.files[0])}
                />
                <br />
                <button onClick={importProducts}>
                    Import Produits
                </button>
            </div>

        </MainLayout>
    );

}

export default ImportFile;