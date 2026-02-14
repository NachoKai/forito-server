import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Post, PostDocument } from "../schemas/post.schema";

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async findAll() {
    return this.postModel.find().sort({ _id: -1 }).lean();
  }

  async findAllPaginated(page: number, limit: number) {
    const startIndex = (page - 1) * limit;
    return this.postModel.find().sort({ _id: -1 }).limit(limit).skip(startIndex).lean();
  }

  async count() {
    return this.postModel.countDocuments({});
  }

  async findById(id: string) {
    return this.postModel.findById(id).lean();
  }

  async findByCreator(creatorId: string) {
    return this.postModel.find({ creator: { $eq: creatorId } }).lean();
  }

  async findSavedByUser(userId: string) {
    return this.postModel.find({ saves: { $eq: userId } }).lean();
  }

  async findBySearch(query: RegExp, tags: string[]) {
    return this.postModel
      .find({
        $or: [{ title: query }, { tags: { $in: tags } }],
      })
      .lean();
  }

  async create(data: Partial<Post>) {
    return this.postModel.create(data);
  }

  async findByIdAndUpdate(id: string, data: Partial<Post>) {
    return this.postModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async findByIdAndDelete(id: string) {
    return this.postModel.findByIdAndDelete(id).lean();
  }
}
