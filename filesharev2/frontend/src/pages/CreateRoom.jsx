import { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { FiEdit3, FiCheck } from "react-icons/fi";
import "./CreateRoom.css";

export default function CreateRoom() {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        setError("");
        
        if (!name.trim()) {
            setError("Room name is required");
            return;
        }

        setLoading(true);
        try {
            const res = await api.createRoom(name, desc, 2);
            console.log("ROOM RESPONSE:", res);
            localStorage.setItem("room", JSON.stringify(res));
            navigate("/dashboard");
        } catch (err) {
            setError("Error creating room. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleCreate();
        }
    };

    return (
        <div className="center">
            <div className="container">
                <h1>Create New Room</h1>
                <p className="subtitle">Set up a new file sharing room</p>

                <div className="form-group">
                    <div className="input-wrapper">
                        <FiEdit3 className="input-icon" />
                        <input
                            className="form-input"
                            placeholder="Room Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>

                    <div className="input-wrapper">
                        <textarea
                            className="form-textarea"
                            placeholder="Description (optional)"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows="4"
                        />
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button 
                    className="create-button"
                    onClick={handleCreate}
                    disabled={loading}
                >
                    <FiCheck /> {loading ? "Creating..." : "Create Room"}
                </button>

                <p className="back-link">
                    Back to <span onClick={() => navigate("/")} className="home-link">Home</span>
                </p>
            </div>
        </div>
    );
}