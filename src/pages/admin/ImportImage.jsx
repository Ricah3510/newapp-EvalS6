import { useState } from "react";
import JSZip from "jszip";
import MainLayout from "../../layouts/admin/MainLayout";
import { getProductBySku, uploadProductImage } from "../../services/admin/importService";
import "../../styles/admin.css"; // Intégration de la feuille de style uniforme du back-office

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

function ImportImages() {
    const [zipFile, setZipFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);

    const handleFileChange = (e) => {
        setZipFile(e.target.files[0]);
        setLogs([]);
    };

    const importImages = async () => {
        if (!zipFile) return;
        setLoading(true);
        setLogs([{ status: "info", label: "Initialisation", error: "Lecture et extraction de l'archive ZIP..." }]);
    
        const currentLogs = [];
    
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
                    currentLogs.push({ status: "skipped", label: filename, error: `SKU "${sku}" introuvable` });
                    setLogs([...currentLogs]);
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
                    currentLogs.push({ status: "success", label: `${filename} → Produit #${product.id}` });
                } catch (error) {
                    // ← DEBUG : voir l'erreur complète
                    console.log("Erreur upload :", error.response?.data);
                    currentLogs.push({ status: "error", label: filename, error: error.response?.data?.message ?? error.message });
                }
    
                setLogs([...currentLogs]);
            }
    
        } catch (error) {
            console.log("ZIP error:", error);
            currentLogs.push({ status: "error", label: "Erreur Critique", error: "Le fichier ZIP semble corrompu ou illisible." });
            setLogs([...currentLogs]);
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
            <div className="page">
                <h1 className="page-title">Import Images</h1>
                <p className="page-subtitle">Rattachement de médias en masse via une archive compressée .zip</p>
                <hr className="page-divider" />

                <section className="import-card">
                    <h2>Traitement de la galerie multimédia</h2>
                    <p className="import-card-desc">
                        Sélectionnez un fichier <code>.zip</code> contenant les images nommées strictement d'après le SKU cible.
                        <br />
                        <strong>Exemples attendus :</strong> <code>sk-l.jpg</code>, <code>sk-m.png</code>, <code>sk-s.webp</code>
                        <br />
                        <small style={{ color: "var(--clr-muted)" }}>Extensions acceptées : jpg, jpeg, png, webp, gif</small>
                    </p>

                    <div className="import-file-wrapper">
                        <input
                            type="file"
                            accept=".zip"
                            className="import-file-input"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                        <button
                            onClick={importImages}
                            className="btn btn--accent"
                            disabled={!zipFile || loading}
                        >
                            {loading ? "Importation en cours..." : "Lancer l'import images"}
                        </button>
                    </div>

                    {/* Zone d'affichage des compteurs globaux */}
                    {logs.length > 0 && (
                        <div style={{ marginTop: "1.5rem" }}>
                            <p style={{ fontWeight: "600", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                                Images associées : <span style={{ color: "green" }}>{countSuccess}</span> | 
                                Ignorées : <span style={{ color: "orange" }}>{countSkipped}</span> | 
                                Échecs : <span style={{ color: "red" }}>{countError}</span>
                                {!loading && " 🏁 [MÉDIAS TRAITÉS]"}
                            </p>

                            {/* Console/Terminal de sortie de logs */}
                            <div className="import-console-box">
                                <div className="import-console-header">
                                    <span>Console Pipeline Images</span>
                                    <span>{loading ? "Flux actif" : "En attente"}</span>
                                </div>
                                {logs.map((log, i) => (
                                    <div 
                                        key={i} 
                                        className={`import-log-item ${
                                            log.status === "success" ? "success" : 
                                            log.status === "skipped" ? "info" : "error"
                                        }`}
                                    >
                                        {log.status === "success" && "[SUCCÈS] "}
                                        {log.status === "skipped" && "[IGNORÉ] "}
                                        {log.status === "error" && "[ÉCHEC] "}
                                        {log.label}
                                        {log.error && <span style={{ opacity: 0.8, fontSize: "0.8rem" }}> — {log.error}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}

export default ImportImages;