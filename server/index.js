import express from 'express';
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors()); // allows your react app to talk to this server

//create the HTTP server using Express
const httpServer = createServer(app);

// initialize socket.io and point it to our HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // the default Vite port
        methods: ["GET", "POST"]
    }
});

// listen for the connection event
io.on("connection", (socket)=>{
    console.log(`User connected: ${socket.id}`);

    // listen for join_room event
    socket.on("join_room", (data) => {
        socket.join(data); // this is a built-in socket.io function
        console.log(`User ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        //broadcast the message ONLY To people in that specific room
        socket.to(data.room).emit("receive_message", data);
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
