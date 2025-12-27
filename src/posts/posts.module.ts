import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { Post, PostSchema } from "./schemas/post.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}

