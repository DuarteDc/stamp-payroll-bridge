import { IsString, IsNotEmpty } from 'class-validator';

export class LoginTenantDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
