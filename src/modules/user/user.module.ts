import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@/modules/user/user.schema';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}])
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule {}
