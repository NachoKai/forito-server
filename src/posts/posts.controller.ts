import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";

import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { AddCommentDto } from "./dto/add-comment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/user.decorator";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get("top")
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get("search")
  getPostsBySearch(@Query("searchQuery") searchQuery?: string, @Query("tags") tags?: string) {
    return this.postsService.getPostsBySearch(searchQuery, tags);
  }

  @Get("creator")
  getPostsByCreator(@Query("id") id: string) {
    return this.postsService.getPostsByCreator(id);
  }

  @Get("saved")
  @UseGuards(JwtAuthGuard)
  getSavedPosts(@CurrentUser() user: any) {
    return this.postsService.getSavedPosts(user.userId);
  }

  @Get()
  getPosts(@Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number) {
    return this.postsService.getPosts(page);
  }

  @Get(":id")
  getPost(@Param("id") id: string) {
    return this.postsService.getPost(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(@Body() createPostDto: CreatePostDto, @CurrentUser() user: any) {
    return this.postsService.createPost(createPostDto, user.userId);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  updatePost(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  deletePost(@Param("id") id: string) {
    return this.postsService.deletePost(id);
  }

  @Patch(":id/likePost")
  @UseGuards(JwtAuthGuard)
  likePost(@Param("id") id: string, @CurrentUser() user: any) {
    return this.postsService.likePost(id, user.userId);
  }

  @Patch(":id/savePost")
  @UseGuards(JwtAuthGuard)
  savePost(@Param("id") id: string, @CurrentUser() user: any) {
    return this.postsService.savePost(id, user.userId);
  }

  @Post(":id/addComment")
  @UseGuards(JwtAuthGuard)
  addComment(@Param("id") id: string, @Body() addCommentDto: AddCommentDto) {
    return this.postsService.addComment(id, addCommentDto);
  }

  @Delete(":id/:commentId")
  @UseGuards(JwtAuthGuard)
  deleteComment(@Param("id") id: string, @Param("commentId") commentId: string) {
    return this.postsService.deleteComment(id, commentId);
  }
}

