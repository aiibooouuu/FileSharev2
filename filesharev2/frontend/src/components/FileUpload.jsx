import { useState, useRef } from "react";
import { api } from "../api/api";
import { FiUploadCloud, FiLock, FiFile, FiCheck, FiX } from "react-icons/fi";
import "./FileUpload.css";

export default function FileUpload({ roomId, accessId, role, onUploadComplete }) {
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dragover, setDragover] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // Only show upload for write users
    if (role === "read") {
        return (
            <div className="read-only-notice">
                <FiLock className="read-only-icon" />
                <h3>Read-Only Access</h3>
                <p>You have read-only access to this room. File uploads are disabled.</p>
            </div>
        );
    }

    const uploadFile = async (file) => {
        if (!file) return;

        setLoading(true);
        try {
            await api.uploadFile(roomId, accessId, file);
            
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
            
            if (onUploadComplete) {
                onUploadComplete();
            }
            
            setSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Upload failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragover(true);
    };

    const handleDragLeave = () => {
        setDragover(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragover(false);
        const files = Array.from(e.dataTransfer.files || []);
        setSelectedFiles(files);
    };

    const handleUploadClick = () => {
        if (selectedFiles.length > 0) {
            uploadFile(selectedFiles[0]);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    return (
        <div className="upload-container">
            <div 
                className={`upload-area ${dragover ? "dragover" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <FiUploadCloud className="upload-icon" />
                <p>Drag and drop your files here</p>
                <small>or click to browse</small>
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    disabled={loading}
                    className="upload-input"
                    multiple
                />
            </div>

            {selectedFiles.length > 0 && (
                <div className="uploaded-files">
                    <p className="files-label">Selected Files:</p>
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="uploaded-file-item">
                            <FiFile className="file-icon" />
                            <span className="uploaded-file-name">{file.name}</span>
                            <button
                                className="remove-file-btn"
                                onClick={() => removeFile(index)}
                                disabled={loading}
                            >
                                <FiX />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {uploadSuccess && (
                <div className="upload-success">
                    <FiCheck className="success-icon" />
                    <span>File uploaded successfully! Refreshing...</span>
                </div>
            )}

            {selectedFiles.length > 0 && (
                <button 
                    className="upload-btn"
                    onClick={handleUploadClick}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <FiUploadCloud /> Upload File
                        </>
                    )}
                </button>
            )}
        </div>
    );
}