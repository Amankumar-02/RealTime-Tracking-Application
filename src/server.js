import express from "express";
import { createServer } from "http";
// import { Socket } from "socket.io";
import { Server } from "socket.io";

const port = 3000;
const app = express();

// Create HTTP server
const server = createServer(app);

// Initialize socket.io with the HTTP server
const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    // res.send("Hello");
    res.render("index")
});

io.on('connection', (socket) => {
    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    console.log('a user connected');

    // Handle events
    socket.on('disconnect', () => {
        io.emit("user-disconnected", socket.id);
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log("Server is running on port: ", port);
})