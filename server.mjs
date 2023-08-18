import express from 'express'
import path from 'path';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const __dirname = path.resolve();
import authRouter from "./routes/auth.mjs"
import postRouter from "./routes/post.mjs"
import { decode } from 'punycode';
const app = express()
app.use(express.json());
app.use(cookieParser());

// app.get("/", (req,res)=>{
//     res.send("hello world server side javascript")

// })
app.use("/api/v1" , authRouter)

app.use(express.static(path.join(__dirname, "public")))
app.use((req,res,next)=>{
    console.log("cookies:", req.cookies)
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log("decoded: ", decoded);

        req.body.decoded = {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
        };

        next();

    }
    catch(e){
        res.status(401).send({ message: "invalid token" })
    }
})
app.use("/api/v1" , postRouter)

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
    console.log(`Example server listening on port ${PORT}`)
})