import { app } from "./app";
import dotenv from "dotenv";
import apiKeyRoutes from './routes/apiKeyRoutes';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use('/apikeys', apiKeyRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
