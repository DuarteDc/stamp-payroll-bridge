import { IsOptional, IsString, IsObject } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateAuditDto {
  @IsOptional()
  @IsString()
  user?: User;

  @IsString()
  ip: string;

  @IsString()
  userAgent: string;

  @IsString()
  method: string;

  @IsString()
  path: string;

  @IsOptional()
  @IsObject()
  body?: any;

  @IsOptional()
  @IsString()
  action?: string;
}
