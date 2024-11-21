import dotenv from 'dotenv';

dotenv.config({
  path: process.cwd() + '/.env',
});

export default {
  database_url: '',
  database_password: '',
  port: process.env.PORT,
};
