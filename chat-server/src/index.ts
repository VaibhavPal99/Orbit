import express from "express";
import http from "http";
import cors from "cors"
import { websocketSetup } from "./controller/message.controller.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();
const httpServer = http.createServer(app);


app.use(cors({
    origin: ["http://localhost:5173", "https://orbit-blond.vercel.app/"], // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


websocketSetup(httpServer);

app.use("/api/v1/messages",messageRoutes);

httpServer.listen(3000, () => {
    console.log("server running of port 3000");
})