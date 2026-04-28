import { useNavigate } from "react-router-dom";
import { FiPlus, FiLink } from "react-icons/fi";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="center">
            <div className="container">
                <h1>FileShare</h1>
                <p>Secure file sharing made simple. Create rooms, share files, and manage access with ease.</p>

                <div className="home-buttons">
                    <button onClick={() => navigate("/login")}>
                        <FiPlus /> CREATE A ROOM
                    </button>

                    <button className="secondary" onClick={() => navigate("/room")}>
                        <FiLink /> JOIN EXISTING ROOM
                    </button>
                </div>
            </div>
        </div>
    );
}