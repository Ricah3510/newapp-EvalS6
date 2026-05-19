import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (
            email === "admin@gmail.com"
            &&
            password === "admin123"
        ) {
            localStorage.setItem(
                "admin_token",
                "18|tQSsCzHVY2lt5w51JsrLOS9vmD1uzTfsurL8FKd99238e37f"
            );
            navigate("/admin");
        } else {
            setError("Identifiants de connexion incorrects.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Admin Login</h1>
                
                <form onSubmit={handleSubmit} className="login-form">
                    
                    {error && (
                        <div className="login-error-box">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Adresse Email</label>
                        <input
                            type="email"
                            placeholder="Ex: admin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn--accent"
                        style={{ marginTop: "0.5rem", width: "100%", textAlign: "center" }}
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;