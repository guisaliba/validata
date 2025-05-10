import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'validata',
  entities: [path.join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [
    path.join(__dirname, '..', 'database', 'migrations', '*.{ts,js}'),
  ],
  synchronize: false,
  logging: true,
});
