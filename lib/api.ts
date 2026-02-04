import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type FetchOptions = RequestInit & {
    headers?: Record<string, string>;
    token?: string;
};

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
    const cookieStore = await cookies();
    const token = options.token || cookieStore.get("token")?.value;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Cookie"] = `token=${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        cache: "no-store",
    });

    return response;
}
