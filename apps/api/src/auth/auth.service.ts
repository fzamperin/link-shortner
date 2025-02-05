import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants/jwt.secret';
import { SignInDto } from './dto/sign-in.dto';
import { JwtEntity } from './interfaces/jwt.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({
    email,
    password,
  }: SignInDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password ?? '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload: JwtEntity = { email: user.email, id: user.id };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        subject: user.id,
        issuer: 'url-shortner',
        expiresIn: '1h',
      }),
    };
  }
}
