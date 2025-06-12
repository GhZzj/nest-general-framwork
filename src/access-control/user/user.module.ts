import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@/modules/user/user.schema';
import { UserRepository } from '@/modules/user/user.repository';

@Global()
@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}])
  ],
  controllers: [UserController],
  providers: [UserService,UserRepository],
  exports: [UserRepository]
})

export class UserModule {}
