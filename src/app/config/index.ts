import dotenv from 'dotenv';

dotenv.config({
  path: process.cwd() + '/.env',
});

export default {
  database_password: process.env.DATABASE_PASSWORD,
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
};
