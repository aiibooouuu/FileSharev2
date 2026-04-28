const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const defaultHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
};

const fetchWithHeaders = (url, options = {}) => {
    return fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });
};

export const api = {
    login: async (email, password) => {
        const res = await fetchWithHeaders(`${BASE_URL}/admin/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        console.log("RAW RESPONSE:", data);
        return data;
    },

    createRoom: async (name, description, expiry = 2) => {
        const token = localStorage.getItem("token");
        const res = await fetchWithHeaders(
            `${BASE_URL}/admin/rooms?expiry_hours=${expiry}`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            }
        );
        return res.json();
    },

    enterRoom: async (room_id, access_id) => {
        const res = await fetchWithHeaders(
            `${BASE_URL}/auth/enter?room_id=${room_id}&access_id=${access_id}`,
            { method: "POST" }
        );
        return res.json();
    },

    getFiles: async (room_id) => {
        console.log("BASE_URL:", BASE_URL);
        console.log("Full URL:", `${BASE_URL}/files/list-files?room_id=${room_id}`);
        console.log("Headers:", defaultHeaders);
        
        const res = await fetchWithHeaders(
            `${BASE_URL}/files/list-files?room_id=${room_id}`
        );
        
        console.log("Response status:", res.status);
        console.log("Response ok:", res.ok);

        if (!res.ok) {
            const error = await res.text();
            console.error("Error response body:", error);
            throw new Error(error || "Failed to get files");
        }

        return res.json();
    },

    uploadFile: async (room_id, access_id, file) => {
        const formData = new FormData();
        formData.append("file", file);
        
        const res = await fetchWithHeaders(
            `${BASE_URL}/files/upload?room_id=${room_id}&access_id=${access_id}`,
            { method: "POST", body: formData }
        );

        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || "Upload failed");
        }

        return res.json();
    },

    getUploadUrl: async (room_id, filename, access_id = null) => {
        const params = new URLSearchParams({ room_id, filename });
        if (access_id) {
            params.append("access_id", access_id);
        }

        const res = await fetchWithHeaders(
            `${BASE_URL}/files/upload-url?${params.toString()}`
        );
        
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || "Failed to get upload URL");
        }

        return res.json();
    },

    getDownloadUrl: async (room_id, filename) => {
        const res = await fetchWithHeaders(
            `${BASE_URL}/files/download-url?room_id=${room_id}&filename=${filename}`
        );

        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || "Failed to get download URL");
        }

        return res.json();
    },
};