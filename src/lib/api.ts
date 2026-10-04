export class ApiError extends Error {
    status: number;
    fieldErrors?: Record<string, string[]>;

    constructor(status: number, message: string, fieldErrors?: Record<string, string[]>) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

type Params = Record<string, string | number | undefined | null>;

type Options = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    params?: Params;
};

function toQuery(params?: Params) {
    if (!params) return "";
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        // Skip empty filters so they don't end up in the URL
        if (value !== undefined && value !== null && value !== "") {
            search.set(key, String(value));
        }
    }
    const query = search.toString();
    return query ? `?${query}` : "";
}

export async function api<T>(path: string, options: Options = {}): Promise<T> {
    const { method = "GET", body, params } = options;

    let res: Response;
    try {
        res = await fetch(`/api${path}${toQuery(params)}`, {
            method,
            headers: body ? { "Content-Type": "application/json" } : undefined,
            body: body ? JSON.stringify(body) : undefined,
            credentials: "include",
        });
    } catch {
        // fetch only rejects when no response came back at all (offline, server down)
        throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        // Session expired: send the user to the login page.
        // /auth/* is excluded so a wrong password doesn't trigger a redirect.
        if (res.status === 401 && !path.startsWith("/auth/") && typeof window !== "undefined") {
            // Hard navigation on purpose: it resets the in-memory query cache, and this
            // file is not a component, so useRouter is not available here.
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.assign("/login");
        }
        const fallback =
            res.status >= 500
                ? "The server is having trouble right now. Please try again in a moment."
                : "Something went wrong";
        throw new ApiError(res.status, data?.message ?? fallback, data?.errors);
    }

    return data as T;
}