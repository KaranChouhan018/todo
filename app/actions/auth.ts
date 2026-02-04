"use server";

import { fetchApi } from "@/lib/api";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface ActionResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    created_at: Date;
  };
}

// Register new user
export async function register(formData: FormData): Promise<ActionResponse> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await fetchApi("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }

    if (data.token) {
      await setAuthCookie(data.token);
    }

    return {
      success: true,
      message: "User registered successfully.",
      user: data.user,
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      message: "Server error during registration.",
    };
  }
}

// Login user
export async function login(formData: FormData): Promise<ActionResponse> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await fetchApi("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    if (data.token) {
      await setAuthCookie(data.token);
    }

    return {
      success: true,
      message: "Login successful.",
      user: data.user,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Server error during login.",
    };
  }
}

// Logout user
export async function logout() {
  try {
    // Optional: Call backend logout if needed, but since it's stateless JWT, 
    // just clearing the cookie on Next.js side is effectively logging out.
    // If backend had a blacklist, we would call /auth/logout.
    await fetchApi("/auth/logout", { method: "POST" });
  } catch (err) {
    console.error("Logout API call failed", err);
  }
  await clearAuthCookie();
  redirect("/login");
}

// Get current user
export async function getCurrentUser() {
  try {
    const response = await fetchApi("/api/auth/me");

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
