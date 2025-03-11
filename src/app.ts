import express from "express";
import  { rateLimiter }  from "./middlewares/rateLimiter";
import  apiKeyRouter  from './routes/apiKeyRoutes';

const app = express();
app.use(express.json());

app.use('/api/keys', apiKeyRouter)
// Mock Request
app.get('/api/protected', rateLimiter, (req, res, next) => {
    res.json({ message: 'Request Successful' });
});

export  { app };