import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { loginCustomer } from "../services/authService";
import Popup from "../components/Popup";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [popup, setPopup] = useState({
        show: false,
        message: "",
        type: ""
    });
    const showPopup = (message, type) => {
        setPopup({
            show: true,
            message,
            type
        });
        setTimeout(() => {
            setPopup({
                show: false,
                message: "",
                type: ""
            });
            if (localStorage.getItem("token")) {
                navigate("/panier");
            }
        }, 1500);
    
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginCustomer({
                email,
                password,
                device_name: "react-app"
            });
            console.log(data);
            localStorage.setItem(
                "token",
                data.token
            );
            showPopup(
                "Connexion réussie",
                "success"
            );
        } catch (error) {
            console.error(error);
            showPopup(
                "Email ou mot de passe incorrect",
                "error"
            );
        }

    };

    return (
        <MainLayout>
            {
                popup.show && (
                    <Popup
                        message={popup.message}
                        type={popup.type}
                        onClose={() =>
                            setPopup({
                                show: false,
                                message: "",
                                type: ""
                            })
                        }
                    />
                )
            }
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />
                </div>

                <button type="submit">
                    Se connecter
                </button>

            </form>
        </MainLayout>
    );
}

export default Login;