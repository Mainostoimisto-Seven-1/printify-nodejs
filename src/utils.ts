export const API_URL = "https://";

export async function callApi<TResponse>(options: {
    method: "GET" | "POST";
    path: string;
    headers?: HeadersInit;
    body?: Record<string, unknown>;
    token: string;
}) {
    const response = await fetch(`${API_URL}${options.path}`, {
        method: options.method,
        headers: {
            "User-Agent": "Printify NodeJS Client",
            "Content-Type": "application/json",
            Authorization: `Bearer ${options.token}`,
            ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const data = (await response.json()) as unknown as TResponse;
    return data;
}
