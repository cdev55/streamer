import express from 'express';
import cors from 'cors';
import { streamRoutes } from './routes/stream.routes';
import { handleStreamStart, handleStreamEnd } from './webhooks/mediamtx.webhook';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'OK' }));
app.use('/streams', streamRoutes);
app.post('/webhooks/stream-start', handleStreamStart);
app.post('/webhooks/stream-end', handleStreamEnd);
app.use(errorMiddleware);

export { app };
