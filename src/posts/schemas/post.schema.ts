import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  message: string;

  @Prop({ type: String })
  name?: string;

  @Prop({ type: String })
  privacy?: string;

  @Prop({ type: String })
  creator?: string;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({
    type: {
      url: String,
      name: String,
      id: String,
    },
  })
  selectedFile?: {
    url?: string;
    name?: string;
    id?: string;
  };

  @Prop({ type: [String], default: [] })
  likes: string[];

  @Prop({ type: [String], default: [] })
  saves: string[];

  @Prop({
    type: [
      {
        userId: String,
        name: String,
        comment: String,
        commentId: String,
      },
    ],
    default: [],
  })
  comments: Array<{
    userId?: string;
    name?: string;
    comment?: string;
    commentId?: string;
  }>;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt?: Date;

  @Prop({ type: String })
  alt?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

