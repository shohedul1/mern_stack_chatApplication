import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRoutes from "./routes/authRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import { createServer } from "http";
import { initializeSocket } from "./socket/socket.server.js";


dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5001;

initializeSocket(httpServer);



app.use(express.json({ limit: "5mb" })); // parse JSON request bodies
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/messages", messageRoutes)

httpServer.listen(PORT, () => {
    connectDB();
    console.log("Listering on port " + PORT)
})

