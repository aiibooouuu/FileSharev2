import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import "./Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await api.login(email, password);

            if (res.token) {
                localStorage.setItem("token", res.token);
                navigate("/create-room");
            } else {
                setError("Invalid Credentials");
            }
        } catch (err) {
            setError("Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="center">
            <div className="container">
                <h1>Admin Login</h1>
                <p className="subtitle">Sign in to create and manage rooms</p>

                {error && (
                    <div className="error-flat">
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <div className="input-wrapper">
                        <FiMail className="input-icon" />
                        <input
                            className="form-input"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                    </div>

                    <div className="input-wrapper">
                        <FiLock className="input-icon" />
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                    </div>
                </div>

                <button 
                    className="login-button"
                    onClick={handleLogin} 
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Signing in...
                        </>
                    ) : (
                        "Sign In"
                    )}
                </button>

                <p className="back-link">
                    Back to <span onClick={() => navigate("/")} className="home-link">Home</span>
                </p>
            </div>
        </div>
    );
}