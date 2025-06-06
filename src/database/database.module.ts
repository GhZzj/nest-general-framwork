import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TypeOrmModule } from './typeorm/typeorm.module';
import { MongooseModule } from './mongoose/mongoose.module';

@Module({
  imports: [PrismaModule, TypeOrmModule, MongooseModule]
})
export class DatabaseModule {}
