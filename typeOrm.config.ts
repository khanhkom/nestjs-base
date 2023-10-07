import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'dev',
  password: '12345',
  database: 'nest-test',
  entities: [__dirname + '/**/entities/*.entity.ts'],
  migrations: [__dirname + '/**/migrations/*.ts'],
});
