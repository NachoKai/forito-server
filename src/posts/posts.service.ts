import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Post, PostDocument } from "./schemas/post.schema";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { AddCommentDto } from "./dto/add-comment.dto";
import { escapeRegExp } from "../utils/escapeRegExp";

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async getAllPosts() {
    const posts = await this.postModel.find().sort({ _id: -1 }).lean();
    return {
      data: posts,
      count: posts?.length,
    };
  }

  async getPosts(page: number) {
    const POSTS_LIMIT = 6;
    const startIndex = (Number(page) - 1) * POSTS_LIMIT;
    const total = await this.postModel.countDocuments({});
    const posts = await this.postModel
      .find()
      .sort({ _id: -1 })
      .limit(POSTS_LIMIT)
      .skip(startIndex)
      .lean();

    const privatePostsQuantity = posts?.filter((post) => post.privacy === "private")?.length;
    const postsWithPrivate = await this.postModel
      .find()
      .sort({ _id: -1 })
      .limit(POSTS_LIMIT + privatePostsQuantity)
      .skip(startIndex)
      .lean();

    return {
      data: postsWithPrivate,
      currentPage: Number(page),
      numberOfPages: !isNaN(total) && total > 0 ? Math.ceil(total / POSTS_LIMIT) : 0,
      count: total,
    };
  }

  async getPostsBySearch(searchQuery?: string, tags?: string) {
    if (!searchQuery && !tags) {
      return { data: [] };
    }

    const safeSearchQuery = escapeRegExp(searchQuery || "");
    const title = searchQuery ? new RegExp(safeSearchQuery, "i") : null;
    const posts = await this.postModel
      .find({
        $or: [{ title }, { tags: { $in: tags?.split(",") || [] } }],
      })
      .lean();

    return { data: posts };
  }

  async getPost(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException("Invalid post ID");
    }

    const post = await this.postModel.findById(id).lean();
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  async createPost(createPostDto: CreatePostDto, userId: string) {
    const newPost = new this.postModel({
      ...createPostDto,
      creator: userId,
      createdAt: new Date().toISOString(),
    });

    await newPost.save();
    return newPost;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("No post found.");
    }

    const updatedPost = {
      _id: id,
      name: updatePostDto.name.trim(),
      creator: updatePostDto.creator.trim(),
      title: updatePostDto.title.trim(),
      message: updatePostDto.message.trim(),
      tags: updatePostDto.tags.map((tag) => tag.trim()),
      selectedFile: updatePostDto.selectedFile,
      alt: updatePostDto.alt.trim(),
      privacy: updatePostDto.privacy,
      likes: updatePostDto.likes,
      saves: updatePostDto.saves,
      comments: updatePostDto.comments,
      createdAt: updatePostDto.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const post = await this.postModel.findByIdAndUpdate(id, updatedPost, { new: true }).lean();
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return updatedPost;
  }

  async deletePost(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("No post found.");
    }

    const post = await this.postModel.findByIdAndDelete(id).lean();
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return { message: "Post deleted successfully." };
  }

  async likePost(id: string, userId: string) {
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("No post found.");
    }

    let post;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await this.postModel.findById(id).lean();
    }

    if (!post) {
      throw new BadRequestException("Post not found.");
    }

    const index = post?.likes?.findIndex((id) => id === String(userId));

    if (index === -1) {
      post?.likes?.push(userId);
    } else {
      post.likes = post?.likes.filter((id) => id !== String(userId));
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(id, post, { new: true }).lean();

    return updatedPost;
  }

  async savePost(id: string, userId: string) {
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("No post found.");
    }

    let post;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await this.postModel.findById(id).lean();
    }

    if (!post) {
      throw new BadRequestException("Post not found.");
    }

    const index = post?.saves?.findIndex((id) => id === String(userId));

    if (index === -1) {
      post?.saves?.push(userId);
    } else {
      post.saves = post?.saves?.filter((id) => id !== String(userId));
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(id, post, { new: true }).lean();

    return updatedPost;
  }

  async addComment(id: string, addCommentDto: AddCommentDto) {
    let post;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await this.postModel.findById(id).lean();
    }

    if (!post) {
      throw new NotFoundException("Post not found.");
    }

    post?.comments?.push(addCommentDto.value);
    const updatedPost = await this.postModel.findByIdAndUpdate(id, post, { new: true }).lean();

    return updatedPost;
  }

  async deleteComment(id: string, commentId: string) {
    let post;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await this.postModel.findById(id).lean();
    }

    if (!post) {
      throw new NotFoundException("Post not found.");
    }

    post.comments = post?.comments?.filter((comment) => comment.commentId !== commentId);

    const updatedPost = await this.postModel.findByIdAndUpdate(id, post, { new: true }).lean();

    return updatedPost;
  }

  async getPostsByCreator(creatorId: string) {
    const posts = await this.postModel.find({ creator: { $eq: creatorId } }).lean();
    return { data: posts, count: posts?.length };
  }

  async getSavedPosts(userId: string) {
    const posts = await this.postModel.find({ saves: { $eq: userId } }).lean();
    return { data: posts, count: posts?.length };
  }
}

