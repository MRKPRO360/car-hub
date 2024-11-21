import app from './app';
import config from './src/app/index';

app.listen(config.port, () => {
  console.log(`App is running on ${config.port}`);
});
