import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {

  @Prop()
  username: string;
  @Prop()
  password:string
}
export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User);