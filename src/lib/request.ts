import axios from "axios";
import { useAuthStore } from "@/store/auth";

export const request = axios.create({
    baseURL: "/api", // Next.js rewrite will proxy this to the backend
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
