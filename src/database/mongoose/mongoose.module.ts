import { Module } from '@nestjs/common';
import {MongooseModule as NestMongooseModule} from '@nestjs/mongoose';

@Module({
  imports:[NestMongooseModule.forRoot(`mongodb://root:123456@localhost:27017/nest`)]
})
export class MongooseModule {}
