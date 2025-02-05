import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { jwtConstants } from 'src/auth/constants/jwt.secret';
import { JwtEntity } from 'src/auth/interfaces/jwt.entity';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    // Extract token from headers (assuming 'Authorization' header is used)
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Remove the 'Bearer ' prefix
    const bearerToken = token.split(' ')[1];

    try {
      // Verify the JWT token and get the payload (which contains user ID)
      const decoded = await this.jwtService.verifyAsync<JwtEntity>(
        bearerToken,
        {
          secret: jwtConstants.secret,
        },
      );

      // Attach user ID to request object
      request.userId = decoded.id;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
