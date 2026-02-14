import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User, UserDocument } from "../schemas/user.schema";

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: { $eq: email } }).lean();
  }

  async findById(id: string) {
    return this.userModel.findById(id).lean();
  }

  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async findByIdAndUpdate(id: string, data: Partial<User>) {
    return this.userModel.findOneAndUpdate({ _id: { $eq: id } }, data, { new: true }).lean();
  }

  async findByIdAndDelete(id: string) {
    return this.userModel.findByIdAndDelete(id).lean();
  }
}
