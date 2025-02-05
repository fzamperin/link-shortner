import {
  Controller,
  Get,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FastifyRequest } from 'fastify';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Gets the current user',
  })
  @ApiBearerAuth('access-token')
  @ApiOkResponse()
  async me(@Request() req: FastifyRequest) {
    const user = await this.usersService.findOne({ id: req.userId });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      email: user.email,
    };
  }
}
