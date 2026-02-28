import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`Auth service listening on port ${env.PORT}`);
});
