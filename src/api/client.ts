const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export class ApiError extends Error {
    status: number;
    details: any;

    constructor(message: string, status: number, details?: any) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export const api = async (
    endpoint: string,
    method = "GET",
    body?: any,
    token?: string
) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new ApiError(data?.message || "Request failed", res.status, data);
    }
    return data;
};