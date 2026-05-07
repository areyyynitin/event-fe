const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const parseErrorMessage = (data: any) => {
    if (typeof data?.message === "string" && data.message.trim().length > 0) {
        return data.message;
    }

    if (Array.isArray(data?.issues) && data.issues.length > 0) {
        return data.issues
            .map((issue: any) => `${issue.path?.join(".") || "field"}: ${issue.message}`)
            .join(", ");
    }

    if (typeof data?.error === "string" && data.error.trim().length > 0) {
        return data.error;
    }

    return "Request failed";
};

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
        throw new ApiError(parseErrorMessage(data), res.status, data);
    }
    return data;
};