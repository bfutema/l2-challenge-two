import { DataSource } from 'typeorm';
import { Seed } from './seed';
import { envConfig } from '../config/env.config';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: envConfig.DB_HOST,
    port: envConfig.DB_PORT,
    username: envConfig.DB_USERNAME,
    password: envConfig.DB_PASSWORD,
    database: envConfig.DB_NAME,
    entities: ['src/entities/*.entity.ts'],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('📡 Conexão com o banco de dados estabelecida');

    const seed = new Seed(dataSource);
    await seed.run();

    await dataSource.destroy();
    console.log('🔌 Conexão com o banco de dados encerrada');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

runSeed();
