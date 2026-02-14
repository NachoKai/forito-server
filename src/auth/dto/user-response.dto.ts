export class UserResponseDto {
  _id: string;
  email: string;
  name: string;
  birthday: string | null;
  notifications: string[];
  createdAt: string;
  updatedAt: string;
}
