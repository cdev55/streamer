import express from 'express';
import cors from 'cors';
import { streamRoutes } from './routes/stream.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'OK' }));
app.use('/streams', streamRoutes);
app.use(errorMiddleware);

export { app };
