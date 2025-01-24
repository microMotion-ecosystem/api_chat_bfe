import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user',
    type: String,
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  userName: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    minLength: 6,
    example: 'Password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Whether the user wants to remember the password',
    type: Boolean,
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  rememberPassword?: boolean;
}

