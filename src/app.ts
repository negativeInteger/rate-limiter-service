import express from "express";
import  { rateLimiter }  from "./middlewares/rateLimiter";

const app = express();
app.use(express.json());

app.get('/api/protected', rateLimiter, (req, res) => {
    res.json({ message: 'Request Successful' });
});

export  { app };