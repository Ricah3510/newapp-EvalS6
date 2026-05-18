import { useState } from "react";
import MainLayout from "../../layouts/admin/MainLayout";
import { resetAllData } from "../../services/admin/resetService";
import "../../styles/admin.css"; // Intégration de la feuille de style uniforme du back-office

function ResetData() {
    const [loading, setLoading] = useState(false);
    const [steps,   setSteps]   = useState([]);
    const [done,    setDone]    = useState(false);
    const [error,   setError]   = useState(null);

    const handleReset = async () => {
        const confirmed = window.confirm(
            "Cette action supprimera toutes les données (commandes, produits, clients...).\n\nConfirmer ?"
        );
        if (!confirmed) return;

        setLoading(true);
        setSteps([]);
        setDone(false);
        setError(null);

        try {
            await resetAllData((step) => {
                setSteps((prev) => [...prev, step]);
            });
            setDone(true);
        } catch (err) {
            const msg = err.response?.data?.message ?? err.message;
            setError(msg);
            console.error("Erreur reset :", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="page">
                <h1 className="page-title">Réinitialisation des données</h1>
                <p className="page-subtitle">Outil de purge intégrale de la base de données et de l'index de stockage</p>
                <hr className="page-divider" />

                <section className="import-card" style={{ borderColor: "#f44336" }}>
                    <h2 style={{ color: "#d32f2f" }}>Zone de Danger</h2>
                    <p className="import-card-desc">
                        Cette action est irréversible. Elle supprimera définitivement <strong>toutes les données de la plateforme</strong> : 
                        commandes, factures, expéditions, paniers, listes d'envies, produits, catégories et comptes clients.
                    </p>

                    <div className="import-file-wrapper">
                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="btn"
                            style={{ 
                                backgroundColor: "#d32f2f", 
                                color: "#fff",
                                fontWeight: "600"
                            }}
                        >
                            {loading ? "Purge du système en cours..." : "Réinitialiser toutes les données"}
                        </button>
                    </div>

                    {/* Statuts globaux Succès / Erreur */}
                    {done && !error && (
                        <p style={{ marginTop: "1rem", color: "#4caf50", fontWeight: "bold", fontSize: "0.95rem" }}>
                            Toutes les données ont été réinitialisées avec succès. Le système est propre.
                        </p>
                    )}

                    {error && (
                        <p style={{ marginTop: "1rem", color: "#f44336", fontWeight: "bold", fontSize: "0.95rem" }}>
                            Échec de la réinitialisation : {error}
                        </p>
                    )}

                    {/* Affichage des étapes via la console standardisée */}
                    {steps.length > 0 && (
                        <div className="import-console-box" style={{ marginTop: "1.5rem" }}>
                            <div className="import-console-header">
                                <span>Console Pipeline de Purge</span>
                                <span>{loading ? "Reset Data en cours" : "Arrêté"}</span>
                            </div>
                            {steps.map((step, i) => {
                                const isSuccess = step.startsWith("true");
                                return (
                                    <div 
                                        key={i} 
                                        className={`import-log-item ${isSuccess ? "success" : "info"}`}
                                    >
                                        {isSuccess ? `[OK] ${step.substring(4)}` : `[TRAITEMENT] ${step}`}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}

export default ResetData;