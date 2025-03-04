const BASE_URL = "http://localhost:8000"

export const register = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formData.username, 
                email: formData.email,
                password: formData.password, 
                })
        })

        if (!response.ok) {
            throw new Error("Invalid username, email, or password")
        }
    } catch (err) {
      console.error("Failed to register:", err.message)
      throw err
    }
}
export const login = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username: formData.email,
                password: formData.password,
            }).toString(),
            credentials: "include"
        })

        if (!response.ok) {
            throw new Error("Invalid Email or Password")
        }
    } catch (err) {
      console.error("Failed to Login:", err.message)
      throw err
    }
}

export const logout = async () => {
    try {
        const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include"
        })
        if (!response.ok) {
            throw new Error("Failed to logout successfully")
        }
    } catch (err) {
        console.error("Failed to logout:", err.message)
        throw err
    }
}

export const updateSkills = async (skills) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/skills`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skills }),
            credentials: "include"
        })
        if (!response.ok) {
            throw new Error("Failed to update skills")
        }
        return response.json()
    } catch (err) {
        console.error("Failed to update skills:", err.message)
    }
}
