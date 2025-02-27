import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NewRegisterDto } from './dto/new-register-dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        @Inject(forwardRef(()=> UsersService)) private readonly usersService: UsersService
    ){}
    
    register(newRegisterDto: NewRegisterDto) {
        return this.usersService.createUser(newRegisterDto);
    }
}
