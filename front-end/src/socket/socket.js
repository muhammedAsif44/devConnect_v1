import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  withCredentials: true,
  autoConnect: false, // important - connect manually after login
});
