import mongoose from 'mongoose';
import app from './app';
import config from './src/app/index';

const DB = config.database_url?.replace(
  '<db_password>',
  config.database_password as string
);

const connectDB = async () => {
  try {
    await mongoose.connect(DB as string);

    app.listen(config.port, () => {
      console.log(`App is running on ${config.port}`);
    });
  } catch (err: any) {
    console.error(`Erorr: ${err.message}`);
    process.exit(1);
  }
};

connectDB();
