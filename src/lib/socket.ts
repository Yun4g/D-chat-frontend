import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://d-chat-backend-338h.onrender.com";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, 
  transports: ["websocket"],
});




export const connectSocket = (userId: string) => {
  socket.connect();
  socket.emit("register", userId);
};

export const disconnectSocket = () => {
  socket.disconnect();
};

