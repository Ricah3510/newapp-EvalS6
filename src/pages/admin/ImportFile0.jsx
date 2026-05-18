import { useState } from "react";
import MainLayout from "../../layouts/admin/MainLayout";
import {
    registerCustomer,
    loginCustomer,
    getProductBySku,
    addToCartWithToken,
    getCategories,
    createCategory,
    createProductSkeleton,
    updateProductDetails,
    updateProductStock,
    updateOrderDate,
} from "../../services/admin/importService";

import {
    saveAddress,
    saveShipping,
    savePayment,
    saveOrder,
} from "../../services/checkoutService";

import {
    shipOrder,
    invoiceOrder,
} from "../../services/admin/orderAdminService";

import {
    validateCustomersCSV,
    validateProductsCSV,
    validateOrdersCSV,
    toMysqlDate
} from "../../services/admin/validationService";
import ValidationErrors from "../../components/admin/ValidationErrors";
function ImportFile() {

    const [customerFile, setCustomerFile] = useState(null);
    const [customerCredentials, setCustomerCredentials] = useState([]);
    const [customerErrors, setCustomerErrors] = useState([]);
    const [customerLoading,     setCustomerLoading]     = useState(false);
    const [customerLogs,        setCustomerLogs]        = useState([]);

    const [productFile,    setProductFile]    = useState(null);
    const [productLoading, setProductLoading] = useState(false);
    const [productLogs,    setProductLogs]    = useState([]);
    const [productErrors,  setProductErrors]  = useState([]);

    // Commande
    const [orderFile,    setOrderFile]    = useState(null);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderLogs,    setOrderLogs]    = useState([]);
    const [orderErrors,    setOrderErrors]    = useState([]);

    const handleCustomerFile = (e) => {
        const file = e.target.files[0];
        setCustomerFile(file);
        setCustomerLogs([]);
        setCustomerErrors([]);
    
        const reader = new FileReader();
        reader.onload = (ev) => {
            const errors = validateCustomersCSV(ev.target.result);
            setCustomerErrors(errors);
        };
        reader.readAsText(file);
    };

    const importCustomers = async () => {
        if (!customerFile) return;
        setCustomerLoading(true);
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

                    setCustomerCredentials((prev) => [
                        ...prev,
                        {
                            email:    customer.email,
                            password: customer.password
                        }
                    ]);

                } catch (error) {
                    console.log( "ERROR",customer.email );
                    console.log( error.response.data );
                }
            }
        };
        reader.readAsText(customerFile);
        setCustomerLoading(false);
    };

    const handleProductFile = (e) => {
        const file = e.target.files[0];
        setProductFile(file);
        setProductLogs([]);
        setProductErrors([]);
    
        const reader = new FileReader();
        reader.onload = (ev) => {
            const errors = validateProductsCSV(ev.target.result);
            setProductErrors(errors);
        };
        reader.readAsText(file);
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
        setProductLoading(true);
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
                    // formData.append("special_price_from", toMysqlDate("01/01/2000"));
                    // formData.append("special_price_to", toMysqlDate("01/02/2000"));

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
        setProductLoading(false);
    };

    const handleOrderFile = (e) => {
        const file = e.target.files[0];
        setOrderFile(file);
        setOrderLogs([]);
        setOrderErrors([]);
    
        const reader = new FileReader();
        reader.onload = (ev) => {
            const errors = validateOrdersCSV(ev.target.result);
            setOrderErrors(errors);
        };
        reader.readAsText(file);
    };

    const parseAchat = (achat) => {
        const items = [];
        const regex = /\[""\s*(.*?)\s*""\s*;\s*(\d+)\s*\]/g;
        let match;
        while ((match = regex.exec(achat)) !== null) {
            items.push({
                sku: match[1],
                qty: parseInt(match[2])
            });
        }
        return items;
    };
    
    const parseOrdersCSV = (text) => {
        const lines = text.split("\n");
        return lines
            .slice(1)
            .filter((line) => line.trim() !== "")
            .map((line) => {
                const regex = /(".*?"|[^,]+)(?=,|$)/g;
                const cols  = [];
                let match;
                while ((match = regex.exec(line)) !== null) {
                    cols.push(match[1].replace(/^"|"$/g, "").trim());
                }
                const [date, heure, client, achat, status] = cols;
                return {
                    date,
                    heure,
                    client,
                    items:  parseAchat(achat),
                    status: status?.trim()
                };
            });
    };

    const importOrders = async () => {
        if (!orderFile) return;
        setOrderLoading(true);
        setOrderLogs([]);
    
        const reader = new FileReader();
        reader.onload = async (e) => {
            const logs  = [];
            const rows  = parseOrdersCSV(e.target.result);
    
            for (const row of rows) {
    
                try {
                    const creds = customerCredentials.find(
                        (c) => c.email === row.client
                    );
                    if (!creds) {
                        logs.push({ status: "error", label: row.client, error: "Customer credentials non trouvés" });
                        setOrderLogs([...logs]);
                        continue;
                    }
    
                    await loginCustomer(creds.email, creds.password);
                    console.log("Logged in as", creds.email);
    
                    for (const item of row.items) {
                        const product = await getProductBySku(item.sku);
                        if (!product) {
                            console.log(`SKU ${item.sku} not found`);
                            continue;
                        }
                        await addToCartWithToken(product.id, item.qty);
                        console.log(`Added to cart: ${item.sku} x${item.qty}`);
                    }
    
                    const address = {
                        billing: {
                            id: null,
                            address: ["12 Rue de la Paix"],
                            save_as_address: false,
                            use_for_shipping: true,
                            first_name: "John",
                            last_name:  "Doe",
                            email:      row.client,
                            company_name: "",
                            city:     "Paris",
                            state:    "IDF",
                            country:  "FR",
                            postcode: "75001",
                            phone:    "0600000000"
                        },
                        shipping: {
                            id: null,
                            address: ["12 Rue de la Paix"],
                            save_as_address: false,
                            use_for_shipping: true,
                            first_name: "John",
                            last_name:  "Doe",
                            email:      row.client,
                            company_name: "",
                            city:     "Paris",
                            state:    "IDF",
                            country:  "FR",
                            postcode: "75001",
                            phone:    "0600000000"
                        }
                    };
    
                    await saveAddress(address);
                    console.log("Address saved");
    
                    await saveShipping("free_free");
                    console.log("Shipping saved");
    
                    await savePayment("cashondelivery");
                    console.log("Payment saved");
    
                    const orderData = await saveOrder();
                    const order     = orderData.data.order;
                    console.log("Order created", order.increment_id);
                    
                    await updateOrderDate(order.id, row.date, row.heure);
                    console.log("Date mise à jour :", row.date, row.heure);
                    
                    if (row.status === "completed") {
                        await shipOrder(order);
                        console.log("Order shipped");
                        await invoiceOrder(order);
                        console.log("Order invoiced");
                    }
    
                    logs.push({
                        status: "success",
                        label:  `Commande ${order.increment_id} — ${row.client} (${row.status})`
                    });
    
                } catch (error) {
                    const msg = error.response?.data?.message ?? error.message;
                    console.log("ERROR order:", msg, error.response?.data);
                    logs.push({ status: "error", label: row.client, error: msg });
                }
    
                setOrderLogs([...logs]);
            }
    
            setOrderLoading(false);
        };
        reader.readAsText(orderFile);
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
                <ValidationErrors errors={customerErrors} />
                <button
                    onClick={importCustomers}
                    disabled={!customerFile || customerLoading || customerErrors.length > 0}
                >
                    {customerLoading ? "Import en cours..." : "Import Customers"}
                </button>

                <hr />

                <h2>Import Produits</h2>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleProductFile}
                />
                <br />
                <ValidationErrors errors={productErrors} />
                <button
                    onClick={importProducts}
                    disabled={!productFile || productLoading || productErrors.length > 0}
                >
                    {productLoading ? "Import en cours..." : "Import Produits"}
                </button>


                <hr />

                <h2>Import Commandes</h2>
                {/* <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    Format CSV attendu :{" "}
                    <code>date,heure,client,achat,status</code>
                    <br />
                    <small>• Le client doit avoir été importé dans la même session.</small>
                    <br />
                    <small>• status : <code>pending</code> ou <code>completed</code></small>
                </p> */}

                <input
                    type="file"
                    accept=".csv"
                    onChange={handleOrderFile}
                />
                <br />
                <ValidationErrors errors={orderErrors} />
                <button
                    onClick={importOrders}
                    disabled={!orderFile || orderLoading || orderErrors.length > 0}
                >
                    {orderLoading ? "Import en cours..." : "Import Commandes"}
                </button>

                {orderLogs.length > 0 && (
                    <>
                        <p style={{ marginTop: "0.5rem" }}>
                            Success{orderLogs.filter((l) => l.status === "success").length} /
                            Error{orderLogs.filter((l) => l.status === "error").length}
                        </p>
                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {orderLogs.map((log, i) => (
                                <li
                                    key={i}
                                    style={{
                                        color: log.status === "success" ? "green" : "red",
                                        marginBottom: "0.25rem"
                                    }}
                                >
                                    {log.status === "success" ? "SUCEES" : "ERROR"} {log.label}
                                    {log.error && (
                                        <span style={{ fontSize: "0.85rem" }}>
                                            {" "} {log.error}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

        </MainLayout>
    );

}

export default ImportFile;