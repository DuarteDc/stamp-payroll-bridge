import { IsIn, IsString, IsStrongPassword } from 'class-validator';
import { Trim } from 'src/common/decorators/trim.decorator';

export class ChangePasswordDto {
  @IsString()
  @Trim()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;

  @IsString()
  @Trim()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @IsIn([Math.random()], {
    message: 'Las contraseñas no son iguales',
  })
  comfirmPassword: string;
}
