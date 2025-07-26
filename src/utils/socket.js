const socket = require("socket.io");

const initialSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });
    io.on("connection", (socket) => {
        socket.on("joinChat", () => {

        })
    })
}
module.exports = initialSocket  