const API_BASE_URL = "http://localhost:5001/api";

async function sendDataToBackend(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Request failed");
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

const ApiService = {
    saveOrder: (orderData) => sendDataToBackend("orders", orderData),
    saveContact: (contactData) => sendDataToBackend("contacts", contactData),
    login: (loginData) => sendDataToBackend("auth/login", loginData)
};

window.ApiService = ApiService;