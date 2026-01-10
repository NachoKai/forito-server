import { Controller, Get, Patch, Body, Param, Post, UseGuards } from "@nestjs/common";

import { UsersService } from "./users.service";
import { AuthService } from "../auth/auth.service";
import { SetBirthdayDto } from "./dto/set-birthday.dto";
import { SetNameDto } from "./dto/set-name.dto";
import { SetEmailDto } from "./dto/set-email.dto";
import { AddNotificationDto } from "./dto/add-notification.dto";
import { UpdateNotificationsDto } from "./dto/update-notifications.dto";
import { LoginDto } from "../auth/dto/login.dto";
import { SignupDto } from "../auth/dto/signup.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("user")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("signup")
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Get(":id")
  getUser(@Param("id") id: string) {
    return this.usersService.getUser(id);
  }

  @Patch(":id/setBirthday")
  @UseGuards(JwtAuthGuard)
  setBirthday(@Param("id") id: string, @Body() setBirthdayDto: SetBirthdayDto) {
    return this.usersService.setBirthday(id, setBirthdayDto);
  }

  @Patch(":id/setName")
  @UseGuards(JwtAuthGuard)
  setName(@Param("id") id: string, @Body() setNameDto: SetNameDto) {
    return this.usersService.setName(id, setNameDto);
  }

  @Patch(":id/setEmail")
  @UseGuards(JwtAuthGuard)
  setEmail(@Param("id") id: string, @Body() setEmailDto: SetEmailDto) {
    return this.usersService.setEmail(id, setEmailDto);
  }

  @Get(":id/notifications")
  @UseGuards(JwtAuthGuard)
  getNotifications(@Param("id") id: string) {
    return this.usersService.getNotifications(id);
  }

  @Patch(":id/addNotification")
  @UseGuards(JwtAuthGuard)
  addNotification(@Param("id") id: string, @Body() addNotificationDto: AddNotificationDto) {
    return this.usersService.addNotification(id, addNotificationDto);
  }

  @Patch(":id/updateNotifications")
  @UseGuards(JwtAuthGuard)
  updateNotifications(
    @Param("id") id: string,
    @Body() updateNotificationsDto: UpdateNotificationsDto
  ) {
    return this.usersService.updateNotifications(id, updateNotificationsDto);
  }
}
