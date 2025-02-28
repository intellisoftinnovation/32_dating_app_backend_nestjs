import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NewRegisterDto } from './dto/new-register-dto';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/find-for-login.dto';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(()=> UsersService)) private readonly usersService: UsersService
    ){}
    
    register(newRegisterDto: NewRegisterDto) {
        return this.usersService.createUser(newRegisterDto);
    }

    login(loginDto: LoginDto) {
        return this.usersService.findForLogin(loginDto);
    }


}
