import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  @ApiProperty()
  @Expose()
  email: string;

  @IsString({
    message: 'Password must be a string',
  })
  @ApiProperty()
  @Expose()
  password: string;
}
