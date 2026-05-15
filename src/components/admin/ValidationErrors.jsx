const ValidationErrors = ({ errors }) => {
    if (!errors || errors.length === 0) return null;

    return (
        <div style={{
            border: "1px solid red",
            borderRadius: "4px",
            padding: "1rem",
            marginTop: "0.5rem",
            background: "#fff5f5"
        }}>
            <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>
                {errors.length} erreur(s) détectée(s) — Import bloqué
            </p>
            <ul style={{ marginTop: "0.5rem" }}>
                {errors.map((e, i) => (
                    <li key={i} style={{ color: "red", marginBottom: "0.25rem" }}>
                        <strong>Ligne {e.line} :</strong>{" "}
                        {e.messages.join(" | ")}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ValidationErrors;