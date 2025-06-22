export default () => ({
  postgres: {
    host: process.env.DB_HOST || 'order-postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'order_db',
    synchronize: process.env.TYPEORM_SYNC === 'true',
  },
});
