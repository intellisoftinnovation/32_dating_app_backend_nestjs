import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as bycrypt from 'bcrypt'
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { MetaData } from './schemas/meta-data.schema';
import { Profile } from './schemas/profile.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(MetaData.name) private readonly metaDataModel: Model<MetaData>,
        @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
        private readonly jwtService: JwtService
    ) { }

    async createUser(createUserDto: CreateUserDto) {
        createUserDto.password = bycrypt.hashSync(createUserDto.password, bycrypt.genSaltSync())
        const user = await this.userModel.create(createUserDto);
        const metaData = await this.metaDataModel.create({ userId: user._id });
        const profile = await this.profileModel.create({ userId: user._id });

        await this.userModel.findByIdAndUpdate(user._id, { metaData: metaData._id, profile: profile._id });

        const token  = await this.jwtService.signAsync({ id: user._id });

        return { message: 'User created', id: user._id, token };
    }

    async getSelfUser(id: string) {
        // TODO: Clean outputs with - & + select strategy
        const user = await this.userModel.findById(id);
        await user.populate('metaData');
        await user.populate('profile');
        if (!user) throw new HttpException({ message: `User ${id} not found`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);

        return user;
    }


    async updateUser(id: string, updateUserDto: UpdateUserDto) {

        const { name, email, password, altura, appearance, birthdate, bodyType, description, familySituation, gender, geoLocation, language, photos, profit, smoking, socialNetworks, onBoardingCompleted , polityAgreement } = updateUserDto

        const user = await this.userModel.findById(id);
        if (!user) throw new HttpException({ message: `User ${id} not found`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);

        await user.populate('metaData');
        await user.populate('profile');

        if (name) await this.userModel.updateOne({ _id: user._id }, { $set: { name } });
        if (email) await this.userModel.updateOne({ _id: user._id }, { $set: { email } });

        if (password) {
            const passwordHash = bycrypt.hashSync(password, bycrypt.genSaltSync())
            await this.userModel.updateOne({ _id: user._id }, { $set: { password: passwordHash } });
        }

        if (altura) await this.profileModel.updateOne({ _id: user.profile }, { $set: { altura } });
        if (appearance) await this.profileModel.updateOne({ _id: user.profile }, { $set: { appearance } });
        if (birthdate) await this.profileModel.updateOne({ _id: user.profile }, { $set: { birthdate } });
        if (bodyType) await this.profileModel.updateOne({ _id: user.profile }, { $set: { bodyType } });
        if (description) await this.profileModel.updateOne({ _id: user.profile }, { $set: { description } });
        if (familySituation) await this.profileModel.updateOne({ _id: user.profile }, { $set: { familySituation } });
        if (gender) await this.profileModel.updateOne({ _id: user.profile }, { $set: { gender } });

        if (geoLocation) {
            await this.profileModel.updateOne({ _id: user.profile }, {
                $set: {
                    "geoLocations.latitude": geoLocation.latitude,
                    "geoLocations.longitude": geoLocation.longitude,
                    "geoLocations.country": geoLocation.country,
                    "geoLocations.city": geoLocation.city
                }
            })
        };

        if (language) await this.profileModel.updateOne({ _id: user.profile }, { $set: { language } });
        if(photos) await this.profileModel.updateOne({ _id: user.profile }, { $set: { photos } });
        if(socialNetworks) await this.profileModel.updateOne({ _id: user.profile }, { $set: { socialNetworks } });

        if (profit) {
            await this.profileModel.updateOne({ _id: user.profile }, {
                $set: {
                    "profit.min": profit.min,
                    "profit.max": profit.max,
                    "profit.currency": profit.currency
                }
            })
        };

        if (smoking) await this.profileModel.updateOne({ _id: user.profile }, { $set: { smoking } });

        if(onBoardingCompleted) await this.profileModel.updateOne({ _id: user.profile }, { $set: { onBoardingCompleted } });
        if(polityAgreement) await this.profileModel.updateOne({ _id: user.profile }, { $set: { polityAgreement } });

        return { message: 'User updated', id: user._id };
    }

    async findOneForJwtStragety(id: string) {
        const user = await this.userModel.findById(id);
        await user.populate('metaData');
        return user;
    }
}

