import { useState } from "react";

import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
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
            alert("Login incorrect");
        }

    };

    return (

        <div>
            <h1>Admin Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />
                <br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>

    );

}

export default AdminLogin;