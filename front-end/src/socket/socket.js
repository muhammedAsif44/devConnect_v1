import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Ensure we connect to the root URL, not the specific API endpoint if configured that way
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

export const socket = io(SOCKET_URL, {
  transports: ["polling", "websocket"],
  reconnectionAttempts: 5,
  withCredentials: true,
  autoConnect: false, // important - connect manually after login
});
