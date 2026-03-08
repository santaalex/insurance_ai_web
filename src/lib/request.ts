import axios from "axios";
import { useAuthStore } from "@/store/auth";

export const getBaseUrl = () => {
    // Determine the base URL dynamically based on environment.
    // In production (Vercel), it should be relative for rewriting, or the absolute URL if configured.
    if (process.env.NEXT_PUBLIC_GATEWAY_URL) {
        return process.env.NEXT_PUBLIC_GATEWAY_URL;
    }
    // Local fallback
    return "http://127.0.0.1:8000";
};

export const request = axios.create({
    // The Next.js rewrite proxy handles mapping /api to the backend. This is CRUCIAL to prevent Mixed Content (HTTPS -> HTTP) errors on Vercel.
    baseURL: "/api",
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Inject Token
request.interceptors.request.use(
    (config) => {
        // We use Zustand's getState() to read the token outside of React components
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Logout
request.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear auth state on 401 Unauthorized
            useAuthStore.getState().logout();
            if (typeof window !== "undefined") {
                window.location.href = "/"; // Force redirect to login page
            }
        }
        return Promise.reject(error);
    }
);
