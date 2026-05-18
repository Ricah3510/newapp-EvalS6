import { useState } from "react";
import MainLayout from "../../layouts/admin/MainLayout";
import { resetAllData } from "../../services/admin/resetService";

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
            <div>
                <h1>Réinitialisation des données</h1>
                <hr />

                <p style={{ color: "#666" }}>
                    Cette action supprimera <strong>toutes les données</strong> :
                    commandes, factures, expéditions, paniers, wishlists,
                    produits, catégories et clients.
                </p>

                <button
                    onClick={handleReset}
                    disabled={loading}
                    style={{ color: "white", background: "red", padding: "0.5rem 1.5rem", cursor: "pointer" }}
                >
                    {loading ? "Réinitialisation en cours..." : " Réinitialiser toutes les données"}
                </button>

                {/* Étapes */}
                {steps.length > 0 && (
                    <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
                        {steps.map((step, i) => (
                            <li key={i} style={{ marginBottom: "0.25rem" }}>
                                {step.startsWith("true") ? step : `loading ${step}`}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Succès */}
                {done && !error && (
                    <p style={{ marginTop: "1rem", color: "green", fontWeight: "bold" }}>
                        Toutes les données ont été réinitialisées avec succès.
                    </p>
                )}

                {/* Erreur */}
                {error && (
                    <p style={{ marginTop: "1rem", color: "red" }}>
                        Erreur : {error}
                    </p>
                )}
            </div>
        </MainLayout>
    );
}

export default ResetData;