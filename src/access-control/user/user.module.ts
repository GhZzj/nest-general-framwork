import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserSchema } from './user.schema';

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
