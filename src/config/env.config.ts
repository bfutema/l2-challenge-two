export const envConfig = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_USERNAME: process.env.DB_USERNAME || 'chaves_user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'chaves_password',
  DB_NAME: process.env.DB_NAME || 'chaves_db',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000'),
};
