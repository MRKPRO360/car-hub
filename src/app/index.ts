import dotenv from 'dotenv';

dotenv.config({
  path: process.cwd() + '/.env',
});

export default {
  database_password: process.env.DATABASE_PASSWORD,
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT,
};
