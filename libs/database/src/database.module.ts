import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConnectionConfig, } from './configuration/orm-config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        configuration
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConnectionConfig,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule { }