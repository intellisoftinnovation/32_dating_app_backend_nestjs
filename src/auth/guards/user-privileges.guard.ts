import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_PRIVILEGES } from '../decorators/privileges-protected.decorator';

@Injectable()
export class UserPrivilegesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requirePrivileges = this.reflector.get<string[]>(META_PRIVILEGES, context.getHandler());

    if(!requirePrivileges) return true;
    if(requirePrivileges.length === 0) return true;


    const user = context.switchToHttp().getRequest().user;
    if(!user) throw new HttpException({message:'Internal Server Error :( '}, HttpStatus.INTERNAL_SERVER_ERROR);

    for(const privileges of requirePrivileges) {
      if(user.metaData.privileges.includes(privileges)) return true;
    }
    
    throw new HttpException({message:`You need some of the following privileges: ${requirePrivileges}`}, HttpStatus.FORBIDDEN);
  }
}
