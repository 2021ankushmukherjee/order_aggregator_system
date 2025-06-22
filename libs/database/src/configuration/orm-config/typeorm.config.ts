import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export function databaseConnectionConfig(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config.get<string>('postgres.host'),
    port: config.get<number>('postgres.port'),
    username: config.get<string>('postgres.username'),
    password: config.get<string>('postgres.password'),
    database: config.get<string>('postgres.database'),
    synchronize: config.get<boolean>('postgres.synchronize'),
    autoLoadEntities: true,
  };
}
