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
import "../../styles/admin.css"; // Intégration de la feuille de style uniforme du back-office

function ImportFile() {

    const [customerFile, setCustomerFile] = useState(null);
    const [customerCredentials, setCustomerCredentials] = useState([]);
    const [customerErrors, setCustomerErrors] = useState([]);
    const [customerLoading, setCustomerLoading] = useState(false);
    const [customerLogs, setCustomerLogs] = useState([]);

    const [productFile, setProductFile] = useState(null);
    const [productLoading, setProductLoading] = useState(false);
    const [productLogs, setProductLogs] = useState([]);
    const [productErrors, setProductErrors] = useState([]);

    // Commande
    const [orderFile, setOrderFile] = useState(null);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderLogs, setOrderLogs] = useState([]);
    const [orderErrors, setOrderErrors] = useState([]);

    const handleCustomerFile0 = (e) => {
        const file = e.target.files[0];
        setCustomerFile(file);
        setCustomerLogs([]);
        setCustomerErrors([]);
    
        const reader = new FileReader();
        reader.onload = (ev) => {
            const errors = validateCustomersCSV(ev.target.result);
            setCustomerErrors(errors);
            // setCustomerCredentials((prev) => [
            //     ...prev,
            //     {
            //         email: customer.email,
            //         password: customer.password
            //     }
            // ]);
        };
        reader.readAsText(file);
    };

    const handleCustomerFile = (e) => {
        const file = e.target.files[0];
        setCustomerFile(file);
        setCustomerLogs([]);
        setCustomerErrors([]);
        setCustomerCredentials([]);
    
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target.result;
    
            const errors = validateCustomersCSV(text);
            setCustomerErrors(errors);
    
            const lines = text.split("\n");
            const creds = lines
                .slice(1)
                .filter((line) => line.trim() !== "")
                .map((line) => {
                    const [nom, prenom, email, pwd] = line.split(",");
                    return {
                        email:    email?.trim(),
                        password: pwd?.trim()
                    };
                })
                .filter((c) => c.email && c.password);
    
            setCustomerCredentials(creds);
            console.log("Credentials chargés :", creds);
        };
        reader.readAsText(file);
    };

    const importCustomers = async () => {
        if (!customerFile) return;
        setCustomerLoading(true);
        setCustomerLogs([{ status: "info", text: "Début de l'analyse du fichier clients..." }]);
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split("\n");
            const customers = lines
                .slice(1)
                .filter((line) => line.trim() !== "")
                .map((line) => {
                    const [nom, prenom, email, pwd] = line.split(",");
                    return {
                        first_name: prenom.trim(),
                        last_name: nom.trim(),
                        email: email.trim(),
                        password: pwd.trim(),
                        password_confirmation: pwd.trim()
                    };
                });

            console.log(customers);
            const logs = [...customerLogs, { status: "info", text: `${customers.length} clients trouvés. Traitement lancé...` }];
            setCustomerLogs(logs);

            let successCount = 0;
            let errorCount = 0;

            for (const customer of customers) {
                try {
                    const data = await registerCustomer(customer);
                    console.log("SUCCESS", data);
                    successCount++;

                    setCustomerCredentials((prev) => [
                        ...prev,
                        {
                            email: customer.email,
                            password: customer.password
                        }
                    ]);

                    logs.push({ status: "success", text: `[SUCCÈS] Client inscrit : ${customer.email}` });
                } catch (error) {
                    console.log("ERROR", customer.email);
                    console.log(error.response?.data);
                    errorCount++;
                    logs.push({ status: "error", text: `[ERREUR] Échec pour ${customer.email} (${error.response?.data?.message || "Erreur serveur"})` });
                }
                setCustomerLogs([...logs]);
            }

            // Signal de fin de traitement
            logs.push({ status: "info", text: `IMPORT TERMINÉ — Succès: ${successCount} | Échecs: ${errorCount}` });
            setCustomerLogs([...logs]);
            setCustomerLoading(false);
        };
        reader.readAsText(customerFile);
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

        const res = await getCategories();
        const existing = res.data?.find(
            (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (existing) {
            categoryCache[categoryName] = existing.id;
            return existing.id;
        }

        const formData = new FormData();
        formData.append("locale", "fr");
        formData.append("name", categoryName);
        formData.append("slug", toUrlKey(categoryName));
        formData.append("status", "1");
        formData.append("position", "1");
        formData.append("display_mode", "products_and_description");
        formData.append("description", categoryName);
        formData.append("parent_id", "1");
        formData.append("attributes[]", "9");

        const created = await createCategory(formData);
        categoryCache[categoryName] = created.data.id;
        return created.data.id;
    };

    const importProducts = async () => {
        if (!productFile) return;
        setProductLoading(true);
        setProductLogs([{ status: "info", text: "Initialisation de l'import des articles..." }]);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const lines = e.target.result.split("\n");
            const rows = lines
                .slice(1)
                .filter((line) => line.trim() !== "")
                .map((line) => {
                    const [type, sku, name, Categorie, prix_vente, prix_achat, prix_promo, stock_initial] = line.split(",");
                    return {
                        type: type?.trim() || "simple",
                        sku: sku?.trim(),
                        name: name?.trim(),
                        Categorie: Categorie?.trim(),
                        prix_vente: prix_vente?.trim(),
                        prix_achat: prix_achat?.trim(),
                        prix_promo: prix_promo?.trim(),
                        stock_initial: stock_initial?.trim(),
                    };
                });

            const logs = [...productLogs, { status: "info", text: `${rows.length} lignes à intégrer.` }];
            setProductLogs(logs);

            let successCount = 0;
            let errorCount = 0;

            for (const row of rows) {
                try {
                    // Catégorie
                    const categoryId = await getOrCreateCategory(row.Categorie);

                    // Squelette produit
                    const product = await createProductSkeleton(row.type, row.sku);
                    const productId = product.data.id;

                    // Détails
                    const formData = new FormData();
                    formData.append("_method", "PUT");
                    formData.append("channel", "default");
                    formData.append("locale", "fr");
                    formData.append("sku", row.sku);
                    formData.append("name", row.name);
                    formData.append("url_key", toUrlKey(row.name));
                    formData.append("short_description", row.name);
                    formData.append("description", row.name);
                    formData.append("price", row.prix_vente);
                    formData.append("cost", row.prix_achat);
                    formData.append("status", "1");
                    formData.append("visible_individually", "1");
                    formData.append("guest_checkout", "1");
                    formData.append("manage_stock", "1");
                    formData.append("categories[]", categoryId);
                    formData.append("channels[]", "1");
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
                    successCount++;
                    logs.push({ status: "success", text: `[SUCCÈS] SKU: ${row.sku} — Produit créé et configuré.` });
                } catch (error) {
                    console.log("ERROR", row.sku);
                    console.log(error.response?.data);
                    errorCount++;
                    logs.push({ status: "error", text: `[ERREUR] Échec SKU: ${row.sku} (${error.response?.data?.message || "Erreur de validation"})` });
                }
                setProductLogs([...logs]);
            }

            // Signal de fin de traitement
            logs.push({ status: "info", text: `IMPORT TERMINÉ — Articles créés: ${successCount} | Échecs: ${errorCount}` });
            setProductLogs([...logs]);
            setProductLoading(false);
        };
        reader.readAsText(productFile);
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
                const cols = [];
                let match;
                while ((match = regex.exec(line)) !== null) {
                    cols.push(match[1].replace(/^"|"$/g, "").trim());
                }
                const [date, heure, client, achat, status] = cols;
                return {
                    date,
                    heure,
                    client,
                    items: parseAchat(achat),
                    status: status?.trim()
                };
            });
    };

    const importOrders = async () => {
        if (!orderFile) return;
        setOrderLoading(true);
        setOrderLogs([{ status: "info", label: "Système", error: "Lancement de la routine d'injection des commandes..." }]);
    
        const reader = new FileReader();
        reader.onload = async (e) => {
            const logs = [];
            const rows = parseOrdersCSV(e.target.result);
    
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
                            last_name: "Doe",
                            email: row.client,
                            company_name: "",
                            city: "Paris",
                            state: "IDF",
                            country: "FR",
                            postcode: "75001",
                            phone: "0600000000"
                        },
                        shipping: {
                            id: null,
                            address: ["12 Rue de la Paix"],
                            save_as_address: false,
                            use_for_shipping: true,
                            first_name: "John",
                            last_name: "Doe",
                            email: row.client,
                            company_name: "",
                            city: "Paris",
                            state: "IDF",
                            country: "FR",
                            postcode: "75001",
                            phone: "0600000000"
                        }
                    };
    
                    await saveAddress(address);
                    console.log("Address saved");
    
                    await saveShipping("free_free");
                    console.log("Shipping saved");
    
                    await savePayment("cashondelivery");
                    console.log("Payment saved");
    
                    const orderData = await saveOrder();
                    const order = orderData.data.order;
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
                        label: `Commande ${order.increment_id} — ${row.client} (${row.status})`
                    });
    
                } catch (error) {
                    const msg = error.response?.data?.message ?? error.message;
                    console.log("ERROR order:", msg, error.response?.data);
                    logs.push({ status: "error", label: row.client, error: msg });
                }
    
                setOrderLogs([...logs]);
            }
            
            // Signal de fin de traitement des commandes
            setOrderLoading(false);
        };
        reader.readAsText(orderFile);
    };

    return (
        <MainLayout>
            <div className="page">
                <h1 className="page-title">Import de données</h1>
                <p className="page-subtitle">Alimentation automatisée du catalogue via fichiers structurés CSV</p>
                <hr className="page-divider" />

                <div className="import-sections-grid">
                    
                    {/* MODULE 1 : CUSTOMERS */}
                    <section className="import-card">
                        <h2>Import Clients</h2>
                        <p className="import-card-desc">Fichier requis : colonnes Nom, Prénom, Email, Mot de passe.</p>
                        
                        <div className="import-file-wrapper">
                            <input
                                type="file"
                                accept=".csv"
                                className="import-file-input"
                                onChange={handleCustomerFile}
                                disabled={customerLoading}
                            />
                            <button
                                onClick={importCustomers}
                                className="btn btn--accent"
                                disabled={!customerFile || customerLoading || customerErrors.length > 0}
                            >
                                {customerLoading ? "Importation en cours..." : "Lancer l'import clients"}
                            </button>
                        </div>

                        <ValidationErrors errors={customerErrors} />

                        {customerLogs.length > 0 && (
                            <div className="import-console-box">
                                <div className="import-console-header">
                                    <span>Console Flux d'inscription</span>
                                    <span>{customerLoading ? "Actif" : "Terminé"}</span>
                                </div>
                                {customerLogs.map((log, index) => (
                                    <div key={index} className={`import-log-item ${log.status}`}>
                                        {log.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* MODULE 2 : PRODUCTS */}
                    <section className="import-card">
                        <h2>Import Produits</h2>
                        <p className="import-card-desc">Fichier contenant la structure des prix, des stocks initiaux et des affectations de catégories.</p>
                        
                        <div className="import-file-wrapper">
                            <input
                                type="file"
                                accept=".csv"
                                className="import-file-input"
                                onChange={handleProductFile}
                                disabled={productLoading}
                            />
                            <button
                                onClick={importProducts}
                                className="btn btn--accent"
                                disabled={!productFile || productLoading || productErrors.length > 0}
                            >
                                {productLoading ? "Importation en cours..." : "Lancer l'import produits"}
                            </button>
                        </div>

                        <ValidationErrors errors={productErrors} />

                        {productLogs.length > 0 && (
                            <div className="import-console-box">
                                <div className="import-console-header">
                                    <span>Console Indexation Articles</span>
                                    <span>{productLoading ? "Actif" : "Terminé"}</span>
                                </div>
                                {productLogs.map((log, index) => (
                                    <div key={index} className={`import-log-item ${log.status}`}>
                                        {log.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* MODULE 3 : ORDERS */}
                    <section className="import-card">
                        <h2>Import Commandes</h2>
                        <p className="import-card-desc">
                            Format CSV attendu : <code>date,heure,client,achat,status</code>. 
                            Les comptes clients correspondants doivent être présents pour permettre l'authentification par jeton.
                        </p>
                        
                        <div className="import-file-wrapper">
                            <input
                                type="file"
                                accept=".csv"
                                className="import-file-input"
                                onChange={handleOrderFile}
                                disabled={orderLoading}
                            />
                            <button
                                onClick={importOrders}
                                className="btn btn--accent"
                                disabled={!orderFile || orderLoading || orderErrors.length > 0}
                            >
                                {orderLoading ? "Importation en cours..." : "Lancer l'import commandes"}
                            </button>
                        </div>

                        <ValidationErrors errors={orderErrors} />

                        {orderLogs.length > 0 && (
                            <div className="import-card-result">
                                <p style={{ marginTop: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}>
                                    Succès : <span style={{ color: "green" }}>{orderLogs.filter((l) => l.status === "success").length}</span> | 
                                    Échecs : <span style={{ color: "red" }}>{orderLogs.filter((l) => l.status === "error").length}</span>
                                    {!orderLoading && "[TRAITEMENT INTEGRAL TERMINÉ]"}
                                </p>
                                
                                <div className="import-console-box">
                                    <div className="import-console-header">
                                        <span>Console Pipeline Commandes</span>
                                        <span>{orderLoading ? "En cours" : "Terminé"}</span>
                                    </div>
                                    {orderLogs.map((log, i) => (
                                        <div key={i} className={`import-log-item ${log.status}`}>
                                            {log.status === "success" ? "[SUCCÈS]" : "[ÉCHEC]"} {log.label}
                                            {log.error && <span style={{ opacity: 0.85, fontSize: "0.8rem" }}> — {log.error}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </MainLayout>
    );
}

export default ImportFile;