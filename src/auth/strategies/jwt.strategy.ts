import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/config';
import { ItJwtPayload } from '../interfaces/ItJwtPayload';
import { UsersService } from 'src/users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountStatus } from 'src/users/schemas/meta-data.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: false,
      secretOrKey: envs.JWTSECRET,
    });
  }

  async validate(payload: ItJwtPayload) {

    const user = await this.userService.findOneForJwtStragety(payload.id);
    if (!user || user.metaData.accountStatus === AccountStatus.DELETED) throw new HttpException({
      message: 'You do not have access to the requested resource',
      details: 'User not Found'
    }, HttpStatus.UNAUTHORIZED)

    if (user.metaData.accountStatus === AccountStatus.SUSPENDED) throw new HttpException({
      message: 'Account is suspended',
      details: 'User Inactive'
    }, HttpStatus.FORBIDDEN)

    return user
  }
}