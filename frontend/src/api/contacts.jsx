const BASE_URL = "http://localhost:8000/api";


export const getContacts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/contacts`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch contacts");
        return response.json();
    } catch (err) {
        console.error("Error fetching contacts:", err.message);
        throw err;
    }
};


export const getContact = async (contactId) => {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch contact details");
        return response.json();
    } catch (err) {
        console.error("Error fetching contact:", err.message);
        throw err;
    }
};


export const createContact = async (contactData) => {
    try {
        const response = await fetch(`${BASE_URL}/contacts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contactData),
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to create contact");
        return response.json();
    } catch (err) {
        console.error("Error creating contact:", err.message);
        throw err;
    }
};


export const updateContact = async (contactId, contactData) => {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contactData),
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to update contact");
        return response.json();
    } catch (err) {
        console.error("Error updating contact:", err.message);
        throw err;
    }
};


export const deleteContact = async (contactId) => {
    try {
        const response = await fetch(`${BASE_URL}/contacts/${contactId}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to delete contact");
        return response.json();
    } catch (err) {
        console.error("Error deleting contact:", err.message);
        throw err;
    }
};
