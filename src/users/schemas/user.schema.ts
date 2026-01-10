import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  id?: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ type: Date })
  birthday?: Date;

  @Prop({ type: Array, default: [] })
  notifications: any[];
}

export const UserSchema = SchemaFactory.createForClass(User);
