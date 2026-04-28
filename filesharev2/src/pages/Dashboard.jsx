import { useEffect, useState } from "react";
import { api } from "../api/api";
import { FiCopy, FiRefreshCw, FiDownload, FiAlertCircle, FiCheck, FiClipboard, FiLock, FiKey, FiUpload } from "react-icons/fi";
import FileUpload from "../components/FileUpload";
import "./Dashboard.css";

export default function Dashboard() {
    const [room, setRoom] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("room");

        if (stored) {
            const parsed = JSON.parse(stored);
            setRoom(parsed);
            fetchFiles(parsed.room_id);
        }
    }, []);

    const fetchFiles = async (room_id) => {
        setLoading(true);
        try {
            const res = await api.getFiles(room_id);
            console.log("FILES:", res);
            setFiles(res.files || []);
        } catch (err) {
            console.error("Error fetching files:", err);
        } finally {
            setLoading(false);
        }
    };

    const downloadFile = async (filename) => {
        try {
            const res = await api.getDownloadUrl(room.room_id, filename);
            
            if (res.url) {
                window.open(res.url, "_blank");
            }
        } catch (err) {
            console.error("Error downloading file:", err);
            alert("Error downloading file");
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    if (!room) return (
        <div className="center">
            <div className="container">
                <FiAlertCircle style={{ fontSize: "2rem", marginBottom: "12px" }} />
                <h2>No Room Found</h2>
                <p>Create or join a room to get started.</p>
            </div>
        </div>
    );

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                {/* Left Panel - Credentials */}
                <div className="dashboard-left">
                    <div className="credentials-card">
                        <h2>Room Details</h2>
                        <p className="room-name">{room.name}</p>

                        <div className="credentials-list">
                            <div className="credential-item">
                                <label><FiKey className="label-icon" /> Room ID</label>
                                <div className="credential-value">
                                    <code>{room.room_id}</code>
                                    <button 
                                        className="copy-btn"
                                        onClick={() => copyToClipboard(room.room_id, "room_id")}
                                        title="Copy Room ID"
                                    >
                                        {copied === "room_id" ? <FiCheck /> : <FiClipboard />}
                                    </button>
                                </div>
                                {copied === "room_id" && <span className="copied-text">Copied!</span>}
                            </div>

                            <div className="credential-item">
                                <label><FiLock className="label-icon" /> Read Access ID</label>
                                <div className="credential-value">
                                    <code>{room.read_access}</code>
                                    <button 
                                        className="copy-btn"
                                        onClick={() => copyToClipboard(room.read_access, "read")}
                                        title="Copy Read Access ID"
                                    >
                                        {copied === "read" ? <FiCheck /> : <FiClipboard />}
                                    </button>
                                </div>
                                {copied === "read" && <span className="copied-text">Copied!</span>}
                            </div>

                            <div className="credential-item">
                                <label><FiLock className="label-icon" /> Write Access ID</label>
                                <div className="credential-value">
                                    <code>{room.write_access}</code>
                                    <button 
                                        className="copy-btn"
                                        onClick={() => copyToClipboard(room.write_access, "write")}
                                        title="Copy Write Access ID"
                                    >
                                        {copied === "write" ? <FiCheck /> : <FiClipboard />}
                                    </button>
                                </div>
                                {copied === "write" && <span className="copied-text">Copied!</span>}
                            </div>
                        </div>

                        {room.description && (
                            <div className="description-section">
                                <label>Description</label>
                                <p>{room.description}</p>
                            </div>
                        )}

                        <div className="expiry-section">
                            <label>Expires At</label>
                            <p>{new Date(room.expires_at * 1000).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Upload & Files */}
                <div className="dashboard-right">
                    {/* File Upload Section */}
                    <div className="files-card upload-card">
                        <div className="files-header">
                            <h2><FiUpload /> Upload Files</h2>
                        </div>
                        <FileUpload 
                            roomId={room.room_id}
                            accessId={room.write_access}
                            role="write"
                            onUploadComplete={() => fetchFiles(room.room_id)}
                        />
                    </div>

                    {/* File History Section */}
                    <div className="files-card history-card">
                        <div className="files-header">
                            <h2><FiDownload /> File History</h2>
                            <button 
                                className="refresh-btn"
                                onClick={() => fetchFiles(room.room_id)}
                                disabled={loading}
                            >
                                <FiRefreshCw /> Refresh
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading-state">
                                <p>Loading files...</p>
                            </div>
                        ) : files.length === 0 ? (
                            <div className="empty-state">
                                <FiAlertCircle />
                                <p>No files uploaded yet</p>
                                <small>Upload files using the form above</small>
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
        </div>
    );
}