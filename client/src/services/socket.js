import socketIOClient from "socket.io-client";

const serverEndpoint = "<your-nodejs-server-url>";

export const socket = socketIOClient(serverEndpoint, {
    transports: ['websocket']
});