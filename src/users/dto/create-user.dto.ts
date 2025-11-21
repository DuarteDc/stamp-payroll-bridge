import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/auth/interfaces/user-role.interface';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @MinLength(8)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: string;

  @IsNotEmpty()
  @IsUUID()
  tenant: string;
}
