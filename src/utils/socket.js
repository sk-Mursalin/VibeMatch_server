const socket = require("socket.io");

const initialSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });
    io.on("connection", (socket) => {
        socket.on("joinChat", ({ userId, targetUserId }) => {
            const room = [userId, targetUserId].sort().join("_");
            console.log(room);
            socket.join(room);
        })

        socket.on("sendMessage", ({ messages, userId, targetUserId }) => {
            const room = [userId, targetUserId].sort().join("_");
            console.log(messages);
            io.to(room).emit("recivedMessage", {messages,targetUserId} )

        })
    })
}
module.exports = initialSocket  