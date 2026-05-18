import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { loginCustomer } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginCustomer({
                email,
                password,
                device_name: "react-app"
            });
            console.log(data);
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MainLayout>
            <div className="page">
                <div className="auth-container">
                    <h1 className="page-title" style={{ fontSize: '2rem', textAlign: 'center' }}>
                        Connexion
                    </h1>
                    <hr className="page-divider" style={{ margin: '0.75rem auto 1.5rem auto' }} />

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                                required
                            />
                        </div>

                        <div className="auth-form-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn--accent"
                            style={{ marginTop: '0.5rem', width: '100%' }}
                        >
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}

export default Login;