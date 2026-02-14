import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { User, UserDocument } from "./schemas/user.schema";
import { UsersRepository } from "./repositories/users.repository";
import { SetBirthdayDto } from "./dto/set-birthday.dto";
import { SetNameDto } from "./dto/set-name.dto";
import { SetEmailDto } from "./dto/set-email.dto";
import { AddNotificationDto } from "./dto/add-notification.dto";
import { UpdateNotificationsDto } from "./dto/update-notifications.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersRepository: UsersRepository
  ) {}

  async getUser(id: string) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestException("Invalid user ID");
    }

    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async setBirthday(id: string, setBirthdayDto: SetBirthdayDto) {
    const { birthday } = setBirthdayDto;

    if (!birthday || !/^\d{4}\/\d{2}\/\d{2}$/.test(birthday)) {
      throw new BadRequestException(
        "Invalid birthday provided. Please provide a valid date in the format yyyy/mm/dd."
      );
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const updatedUser = await this.usersRepository.findByIdAndUpdate(id, {
      birthday: new Date(birthday),
    });

    if (!updatedUser) {
      throw new NotFoundException("User doesn't exist.");
    }

    return updatedUser;
  }

  async setName(id: string, setNameDto: SetNameDto) {
    const { firstName, lastName } = setNameDto;

    if (!firstName || typeof firstName !== "string") {
      throw new BadRequestException("Invalid first name provided.");
    }

    if (lastName && typeof lastName !== "string") {
      throw new BadRequestException("Invalid last name provided.");
    }

    const updateObject = { name: firstName };

    if (lastName) {
      updateObject.name = `${firstName} ${lastName}`;
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const updatedUser = await this.usersRepository.findByIdAndUpdate(id, updateObject);

    if (!updatedUser) {
      throw new NotFoundException("User doesn't exist.");
    }

    return updatedUser;
  }

  async setEmail(id: string, setEmailDto: SetEmailDto) {
    const { email } = setEmailDto;
    const existingUser = await this.usersRepository.findByEmail(email.email);

    if (existingUser) {
      throw new ConflictException("User already exists.");
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const updatedUser = await this.usersRepository.findByIdAndUpdate(id, { email: email.email });

    if (!updatedUser) {
      throw new NotFoundException("User doesn't exist.");
    }

    return updatedUser;
  }

  async getNotifications(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException("User doesn't exist.");
    }

    return user.notifications;
  }

  async addNotification(id: string, addNotificationDto: AddNotificationDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException("User doesn't exist.");
    }

    user.notifications.push(addNotificationDto.notification);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, { new: true }).lean();

    return updatedUser;
  }

  async updateNotifications(id: string, updateNotificationsDto: UpdateNotificationsDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException("User doesn't exist.");
    }

    const updatedNotifications = user.notifications.map((notification) => {
      const updatedNotification = updateNotificationsDto.notifications.find(
        (n) => n._id === notification._id
      );
      return updatedNotification ? updatedNotification : notification;
    });

    user.notifications = updatedNotifications;
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, { new: true }).lean();

    return updatedUser;
  }
}
