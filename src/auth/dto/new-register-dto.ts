// import { ApiProperty } from "@nestjs/swagger";
// import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class NewRegisterDto  extends CreateUserDto{
}