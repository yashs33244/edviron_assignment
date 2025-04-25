import app from './app';
import { env } from './config/env';
import logger from './utils/logger';


const PORT = env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});