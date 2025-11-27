import express from "express"
import path from 'path'
import dotenv from "dotenv"
import cors from "cors"
import "./database/conn.js"
import { userRouter } from "./routers/userRouter.js"
dotenv.config({ path: "./config.env" })
const app = express()
let port = process.env.PORT || 5012
app.use(express.static("public"))
// app.use("/uploads",express.static("uploads"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
  origin: "*",
  methods: "*",
};
app.use(cors(corsOptions))
// routers
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/user", userRouter)
// handle 404 route
app.use((req, res) => {
  console.log("user trying to access invalid route !")
  res.status(404).json({ message: "content/route not found !" })
})
app.listen(port, () => {
  console.log(`server is running on port ${port} !`)
})