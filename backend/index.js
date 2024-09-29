import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'
import connectDB from "./utils/db.js"
import userRoute from "./Routes/userRoute.js"
import postRoute from "./Routes/postRoute.js"
import messageRoute from "./Routes/messageRoute.js"
dotenv.config({})
import { app, server } from "./scoket/socket.js"
import path from "path"

const PORT = process.env.PORT || 8000;

const __dirname = path.resolve();

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
const corsOptions = {
     origin: 'https://social-media-mern-xm15.onrender.com/',
     credentials: true
}
app.use(cors(corsOptions));


app.use("/api/v1/user", userRoute)
app.use("/api/v1/post", postRoute)
app.use("/api/v1/message", messageRoute)


app.use(express.static(path.join(__dirname, "/frontend/dist")))

app.get("*", (req, res) => {
     res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})

server.listen(PORT, () => {
     connectDB();
     console.log(`Server is running on ${PORT}`)
})


