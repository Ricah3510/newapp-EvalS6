import { useState } from "react";
import JSZip from "jszip";
import MainLayout from "../../layouts/admin/MainLayout";
import { getProductBySku, uploadProductImage } from "../../services/admin/importService";
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

function ImportImages() {
    const [zipFile,      setZipFile]      = useState(null);
    const [loading,      setLoading]      = useState(false);
    const [logs,         setLogs]         = useState([]);

    const handleFileChange = (e) => {
        setZipFile(e.target.files[0]);
        setLogs([]);
    };

    const importImages = async () => {
        if (!zipFile) return;
        setLoading(true);
        setLogs([]);
    
        const logs = [];
    
        try {
            const zip   = await JSZip.loadAsync(zipFile);
            const files = Object.values(zip.files).filter((f) => !f.dir);
    
            // ← DEBUG : voir ce que contient le ZIP
            console.log("Fichiers dans le ZIP :", files.map(f => f.name));
    
            for (const zipEntry of files) {
                const filename = zipEntry.name.split("/").pop();
                console.log("Traitement :", filename);
    
                if (!filename || filename.startsWith(".")) continue;
    
                const ext = filename.split(".").pop().toLowerCase();
                console.log("Extension :", ext);
    
                if (!ALLOWED_EXTENSIONS.includes(ext)) continue;
    
                const sku = filename.replace(/\.[^/.]+$/, "");
                console.log("SKU extrait :", sku);
    
                const product = await getProductBySku(sku);
                console.log("Produit trouvé :", product);
    
                if (!product) {
                    console.log(`SKU ${sku} not found`);
                    logs.push({ status: "skipped", label: filename, error: `SKU "${sku}" not found` });
                    setLogs([...logs]);
                    continue;
                }
    
                // ← DEBUG : voir ce qu'on envoie à Bagisto
                console.log("product.categories :", product.categories);
                console.log("product.short_description :", product.short_description);
                console.log("product.url_key :", product.url_key);
    
                const blob      = await zipEntry.async("blob");
                const mimeType  = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
                const imageFile = new File([blob], filename, { type: mimeType });
    
                try {
                    const result = await uploadProductImage(product.id, {
                        ...product,
                        imageFile
                    });
                    // ← DEBUG : voir la réponse
                    console.log("Réponse Bagisto :", result);
                    logs.push({ status: "success", label: `${filename} → #${product.id}` });
                } catch (error) {
                    // ← DEBUG : voir l'erreur complète
                    console.log("Erreur upload :", error.response?.data);
                    logs.push({ status: "error", label: filename, error: error.response?.data?.message ?? error.message });
                }
    
                setLogs([...logs]);
            }
    
        } catch (error) {
            console.log("ZIP error:", error);
        }
    
        setLoading(false);
    };

    // ── Compteurs ─────────────────────────────────────────────────────
    const countSuccess = logs.filter((l) => l.status === "success").length;
    const countSkipped = logs.filter((l) => l.status === "skipped").length;
    const countError   = logs.filter((l) => l.status === "error").length;

    // ── JSX ───────────────────────────────────────────────────────────
    return (
        <MainLayout>
            <div>
                <h1>Import Images</h1>
                <hr />

                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    Importer un fichier <code>.zip</code> contenant les images nommées par SKU.
                    <br />
                    <strong>Exemple :</strong> <code>sk-l.jpg</code>, <code>sk-m.png</code>, <code>sk-s.jpeg</code>
                    <br />
                    <small>Extensions acceptées : jpg, jpeg, png, webp, gif</small>
                </p>

                <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                />

                <br />

                <button
                    onClick={importImages}
                    disabled={!zipFile || loading}
                    style={{ marginTop: "0.5rem" }}
                >
                    {loading ? "Import en cours..." : "Import Images"}
                </button>

                {/* Compteurs */}
                {logs.length > 0 && (
                    <p style={{ marginTop: "1rem" }}>
                        {countSuccess} importée(s) &nbsp;|&nbsp;
                        {countSkipped} ignorée(s) &nbsp;|&nbsp;
                        {countError} erreur(s)
                    </p>
                )}

                {/* Logs ligne par ligne */}
                <ul style={{ marginTop: "0.5rem", listStyle: "none", padding: 0 }}>
                    {logs.map((log, i) => (
                        <li
                            key={i}
                            style={{
                                color:
                                    log.status === "success" ? "green" :
                                    log.status === "skipped" ? "orange" :
                                    "red",
                                marginBottom: "0.25rem",
                            }}
                        >
                            {log.status === "success" && "✅"}
                            {log.status === "skipped" && "⚠️"}
                            {log.status === "error"   && "❌"}
                            &nbsp;{log.label}
                            {log.error && (
                                <span style={{ fontSize: "0.85rem" }}>
                                    {" "}— {log.error}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>

            </div>
        </MainLayout>
    );
}

export default ImportImages;
