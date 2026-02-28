import express from 'express';
import { streamRoutes } from './modules/streams/stream.routes';
import { mediamtxWebhook } from './webhooks/mediamtx.webhook';

const app = express();
app.use(express.json());
app.use('/streams', streamRoutes);
app.use('/webhooks/mediamtx', mediamtxWebhook);

export { app };
