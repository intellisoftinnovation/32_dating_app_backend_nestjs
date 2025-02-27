import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as bycrypt from 'bcrypt'
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { MetaData } from './schemas/meta-data.schema';
import { Profile } from './schemas/profile.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(MetaData.name) private readonly metaDataModel: Model<MetaData>,
        @InjectModel(Profile.name) private readonly profileModel: Model<Profile>
    ){}

    async createUser(createUserDto: CreateUserDto){
        createUserDto.password  = bycrypt.hashSync(createUserDto.password , bycrypt.genSaltSync())
        const user = await this.userModel.create(createUserDto);
        const metaData = await this.metaDataModel.create({userId: user._id});
        const profile = await this.profileModel.create({userId: user._id});       

        await this.userModel.findByIdAndUpdate(user._id, {metaData: metaData._id , profile: profile._id});

        return {message: 'User created' , id: user._id , token: "3DA-10"};
    }

    async getSelfUser(id: string){
        // TODO: Clean outputs with - & + select strategy
        const user = await this.userModel.findById(id);
        await user.populate('metaData');
        await user.populate('profile');
        if(!user) throw new HttpException({message: `User ${id} not found` , statusCode: HttpStatus.NOT_FOUND} , HttpStatus.NOT_FOUND);    
        
        return user;
    }


}

