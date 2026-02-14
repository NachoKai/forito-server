import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import bcrypt from "bcryptjs";

import { User, UserDocument } from "../users/schemas/user.schema";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { UserResponseDto } from "./dto/user-response.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  private toUserResponse(doc: UserDocument): UserResponseDto {
    return {
      _id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      birthday: doc.birthday ? doc.birthday.toISOString().split("T")[0] : null,
      notifications: doc.notifications || [],
      createdAt: (doc as any).createdAt?.toString(),
      updatedAt: (doc as any).updatedAt?.toString(),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const existingUser = await this.userModel.findOne({ email: { $eq: email } }).lean();

    if (!existingUser) {
      throw new UnauthorizedException("User doesn't exist.");
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException("Invalid credentials.");
    }

    const token = this.jwtService.sign(
      { email: existingUser.email, id: existingUser._id },
      {
        expiresIn: "24h",
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = existingUser;
    return { result: userWithoutPassword, token };
  }

  async signup(signupDto: SignupDto) {
    const { email, password, confirmPassword, firstName, lastName } = signupDto;

    const existingUser = await this.userModel.findOne({ email: { $eq: email } }).lean();

    if (existingUser) {
      throw new ConflictException("User already exists.");
    }

    if (password !== confirmPassword) {
      throw new UnauthorizedException("Passwords don't match.");
    }

    const salt = Number(this.configService.get<string>("SALT")) || 12;
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await this.userModel.create({
      email,
      password: hashedPassword,
      name: lastName ? `${firstName} ${lastName}` : firstName,
      birthday: null,
    });

    const token = this.jwtService.sign(
      { email: result.email, id: result._id },
      {
        expiresIn: "12h",
      }
    );

    return { result: this.toUserResponse(result), token };
  }
}
