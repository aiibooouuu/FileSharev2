import { useState, useEffect } from "react";
import { api } from "../api/api";
import { FiLink, FiCheck, FiRefreshCw, FiDownload, FiLogOut, FiAlertCircle } from "react-icons/fi";
import FileUpload from "../components/FileUpload";
import "./Room.css";

export default function Room() {
    const [roomId, setRoomId] = useState("");
    const [accessId, setAccessId] = useState("");
    const [joined, setJoined] = useState(false);
    const [role, setRole] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const joinRoom = async () => {
        setError("");
        if (!roomId.trim() || !accessId.trim()) {
            setError("Room ID and Access ID are required");
            return;
        }

        try {
            const res = await api.enterRoom(roomId, accessId);

            if (res.role) {
                setJoined(true);
                setRole(res.role);
                fetchFiles();
            } else {
                setError("Failed to join room");
            }
        } catch (err) {
            console.error("Error joining room:", err);
            setError("Error joining room: " + err.message);
        }
    };

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const res = await api.getFiles(roomId);
            setFiles(res.files || []);
        } catch (err) {
            console.error("Error fetching files:", err);
            setError("Error loading files");
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = async (filename) => {
        try {
            const res = await api.getDownloadUrl(roomId, filename);
            
            if (res.url) {
                window.open(res.url, "_blank");
            }
        } catch (err) {
            console.error("Error downloading file:", err);
            setError("Error downloading file");
        }
    };

    const handleLeaveRoom = () => {
        setJoined(false);
        setRole(null);
        setFiles([]);
        setRoomId("");
        setAccessId("");
        setError("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            joinRoom();
        }
    };

    return (
        <div className="center">
            {!joined ? (
                <div className="container">
                    <h1>Join a Room</h1>
                    <p className="subtitle">Enter the Room ID and Access ID to join a file sharing room</p>

                    <div className="form-group">
                        <div className="input-wrapper">
                            <FiLink className="input-icon" />
                            <input
                                className="form-input"
                                placeholder="Room ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        <div className="input-wrapper">
                            <FiCheck className="input-icon" />
                            <input
                                className="form-input"
                                placeholder="Access ID"
                                value={accessId}
                                onChange={(e) => setAccessId(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button 
                        className="join-button"
                        onClick={joinRoom}
                    >
                        <FiCheck /> Join Room
                    </button>

                    <p className="back-link">
                        Back to <span onClick={() => window.location.href = "/"} className="home-link">Home</span>
                    </p>
                </div>
            ) : (
                <div className="room-container">
                    <div className="room-header">
                        <div>
                            <h1>Room Connected</h1>
                            <p className="role-badge" data-role={role}>
                                {role === "write" ? "Editor" : "Viewer"}
                            </p>
                        </div>
                        <button 
                            className="leave-btn"
                            onClick={handleLeaveRoom}
                        >
                            <FiLogOut /> Leave Room
                        </button>
                    </div>

                    <div className="room-content">
                        {/* File Upload Section */}
                        {role === "write" && (
                            <div className="section">
                                <FileUpload 
                                    roomId={roomId} 
                                    accessId={accessId}
                                    role={role}
                                    onUploadComplete={fetchFiles}
                                />
                            </div>
                        )}

                        {/* Files Section */}
                        <div className="section">
                            <div className="section-header">
                                <h2>Files</h2>
                                <button 
                                    className="refresh-btn"
                                    onClick={fetchFiles}
                                    disabled={loading}
                                >
                                    <FiRefreshCw /> Refresh
                                </button>
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            {loading ? (
                                <div className="loading-state">
                                    <p>Loading files...</p>
                                </div>
                            ) : files.length === 0 ? (
                                <div className="empty-state">
                                    <FiAlertCircle />
                                    <p>No files in this room yet</p>
                                </div>
                            ) : (
                                <div className="files-list">
                                    {files.map((file, index) => (
                                        <div key={index} className="file-item">
                                            <div className="file-info">
                                                <p className="file-name">{file.filename}</p>
                                                <small className="file-meta">
                                                    {(file.size / 1024).toFixed(2)} KB • {new Date(file.last_modified).toLocaleDateString()}
                                                </small>
                                            </div>
                                            <button 
                                                className="download-btn"
                                                onClick={() => downloadFile(file.filename)}
                                            >
                                                <FiDownload /> Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}