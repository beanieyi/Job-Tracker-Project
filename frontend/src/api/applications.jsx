const BASE_URL = "http://localhost:8000/api";


export const getApplications = async () => {
    try {
        const response = await fetch(`${BASE_URL}/applications`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch applications");
        return response.json();
    } catch (err) {
        console.error("Error fetching applications:", err.message);
        throw err;
    }
};


export const getApplication = async (jobId) => {
    try {
        const response = await fetch(`${BASE_URL}/applications/${jobId}`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch application details");
        return response.json();
    } catch (err) {
        console.error("Error fetching application:", err.message);
        throw err;
    }
};


export const createApplication = async (jobData) => {
    try {
        const response = await fetch(`${BASE_URL}/applications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobData),
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to create application");
        return response.json();
    } catch (err) {
        console.error("Error creating application:", err.message);
        throw err;
    }
};


export const updateApplication = async (jobId, jobData) => {
    try {
        const response = await fetch(`${BASE_URL}/applications/${jobId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobData),
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to update application");
        return response.json();
    } catch (err) {
        console.error("Error updating application:", err.message);
        throw err;
    }
};


export const deleteApplication = async (jobId) => {
    try {
        const response = await fetch(`${BASE_URL}/applications/${jobId}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to delete application");
        return response.json();
    } catch (err) {
        console.error("Error deleting application:", err.message);
        throw err;
    }
};


export const getApplicationTimeline = async (jobId) => {
    try {
        const response = await fetch(`${BASE_URL}/applications/${jobId}/timeline`, {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch application timeline");
        return response.json();
    } catch (err) {
        console.error("Error fetching timeline:", err.message);
        throw err;
    }
};


export const addTimelineEntry = async (jobId, timelineData) => {
    try {
        const response = await fetch(`${BASE_URL}/applications/${jobId}/timeline`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(timelineData),
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to add timeline entry");
        return response.json();
    } catch (err) {
        console.error("Error adding timeline entry:", err.message);
        throw err;
    }
};


export const updateTimelineEntry = async (jobId, timelineId, timelineData) => {
    try {
        const response = await fetch(`${BASE_URL}/applications/${jobId}/timeline/${timelineId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(timelineData),
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to update timeline entry");
        return response.json();
    } catch (err) {
        console.error("Error updating timeline entry:", err.message);
        throw err;
    }
};


export const deleteTimelineEntry = async (jobId, timelineId) => {
    try {
        const response = await fetch(`${BASE_URL}/applications/${jobId}/timeline/${timelineId}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to delete timeline entry");
        return response.json();
    } catch (err) {
        console.error("Error deleting timeline entry:", err.message);
        throw err;
    }
};
