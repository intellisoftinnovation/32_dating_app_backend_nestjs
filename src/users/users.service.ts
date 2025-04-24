import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as bycrypt from 'bcrypt'
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { AccountStatus, MetaData } from './schemas/meta-data.schema';
import { Gender, Profile } from './schemas/profile.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { FindForLoginDto } from './dto/find-for-login.dto';
import { AgeRange, Altura, Preference } from './schemas/preferences-schema';
import { UpdatePreferenceDto } from './dto/update-preferences.dto';
import { getRandomUsers } from './seed/seed.users';
import { Enviroment, GetUsersDto, SortBy } from './dto/get-users.dto';
import { formatTime, getAge } from 'src/tools/TIME';
import { HaverSine } from 'src/tools/HAVERSINE';
import { MatchRequestService } from 'src/match-request/match-request.service';
import { PaymentService } from 'src/payment/payment.service';
import { MatchRequestStatus } from 'src/match-request/schemas/match-request.schema';
import { Complaint } from './schemas/complaint.schema';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { FindAllComplaintsDto } from './dto/find-all-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';




@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(MetaData.name) private readonly metaDataModel: Model<MetaData>,
        @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
        @InjectModel(Preference.name) private readonly preferenceModel: Model<Preference>,
        @InjectModel(Complaint.name) private readonly complaintModel: Model<Complaint>,
        @Inject(forwardRef(() => PaymentService)) private readonly paymentService: PaymentService,
        @Inject(forwardRef(() => MatchRequestService)) private readonly matchRequestService: MatchRequestService,
        private readonly jwtService: JwtService
    ) { }

    async createUser(createUserDto: CreateUserDto) {
        createUserDto.password = bycrypt.hashSync(createUserDto.password, bycrypt.genSaltSync())
        const user = await this.userModel.create(createUserDto);
        const metaData = await this.metaDataModel.create({ userId: user._id });
        const profile = await this.profileModel.create({ userId: user._id });

        await this.userModel.findByIdAndUpdate(user._id, { metaData: metaData._id, profile: profile._id });

        const token = await this.jwtService.signAsync({ id: user._id });
        await this.metaDataModel.findByIdAndUpdate(user.metaData, { $set: { active_session: token } });
        return { message: 'User created', id: user._id, token };
    }

    async getSelfUser(id: string) {
        // TODO: Clean outputs with - & + select strategy
        const user = await this.userModel.findById(id);
        if (!user) throw new HttpException({ message: `User ${id} not found`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);
        await user.populate('metaData');
        await user.populate('profile');

        return user;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {

        const { name, email, englishLevel, etnicidad, password, altura, appearance, birthdate, bodyType, description, familySituation, gender, geoLocation, language, photos, profit, smoking, socialNetworks, onBoardingCompleted, polityAgreement, phone, typeOfRelationFind } = updateUserDto

        const user = await this.userModel.findById(id);
        if (!user) throw new HttpException({ message: `User ${id} not found`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);

        await user.populate('metaData');
        await user.populate('profile');

        if (!Object.keys(updateUserDto).length) throw new HttpException({ message: `Nothing to update`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.BAD_GATEWAY);

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

        if (gender) {
            await this.profileModel.updateOne({ _id: user.profile }, { $set: { gender, genderVerified: false } });
        }


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
        if (photos) {
            if (photos.length > 6) throw new HttpException({ message: `You can only to have 6 photos` }, HttpStatus.BAD_REQUEST)
            await this.profileModel.updateOne({ _id: user.profile }, { $set: { photos } })
        }
        if (socialNetworks) await this.profileModel.updateOne({ _id: user.profile }, { $set: { socialNetworks } });

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

        if (onBoardingCompleted) await this.profileModel.updateOne({ _id: user.profile }, { $set: { onBoardingCompleted } });
        if (polityAgreement) await this.profileModel.updateOne({ _id: user.profile }, { $set: { polityAgreement } });

        if (phone) {
            const phoneInUse = await this.profileModel.findOne({ phone })
            if (phoneInUse) throw new HttpException({ message: `Phone ${phone} already in use` }, HttpStatus.PRECONDITION_FAILED)
            await this.profileModel.updateOne({ _id: user.profile }, { $set: { phone, phoneVerified: false } })
        };

        if (etnicidad) await this.profileModel.updateOne({ _id: user.profile }, { $set: { etnicidad } });
        if (englishLevel) await this.profileModel.updateOne({ _id: user.profile }, { $set: { englishLevel } });
        if (typeOfRelationFind) await this.profileModel.updateOne({ _id: user.profile }, { $set: { typeOfRelationFind } });

        return { message: 'User updated', id: user._id };
    }


    async findOneForJwtStragety(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) return null;
        await user.populate('metaData', '+active_session');
        return user;
    }

    async findForLogin(findForLogin: FindForLoginDto) {
        const { email, password } = findForLogin
        const user = await this.userModel.findOne({ email })
        if (user) await user.populate('metaData', '+active_session')
        // console.log(user)
        if (!user || user.metaData.accountStatus == AccountStatus.DELETED) throw new HttpException({ message: `User with ${email} dont exists` }, HttpStatus.NOT_FOUND)
        if (user.metaData.accountStatus == AccountStatus.SUSPENDED) throw new HttpException({ message: `User with ${email} is suspended` }, HttpStatus.FORBIDDEN)
        if (!bycrypt.compareSync(password, user.password)) throw new HttpException({ message: `Invalid password` }, HttpStatus.UNAUTHORIZED)
        const token = await this.jwtService.signAsync({ id: user._id });
        await this.metaDataModel.findByIdAndUpdate(user.metaData, { $set: { active_session: token } });
        return { message: `User with ${email} logged in`, id: user._id, token }

    }

    async verifyGender(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) throw new HttpException({ message: `User ${id} not found`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);
        await user.populate('profile');
        await this.profileModel.findByIdAndUpdate(user.profile, { $set: { genderVerified: true } });
        return true;
    }

    async verifyPhone(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) throw new HttpException({ message: `User ${id} not found`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);
        await user.populate('profile');
        await this.profileModel.findByIdAndUpdate(user.profile, { $set: { phoneVerified: true } });
        return true;
    }

    async findForPassRecovery(email: string) {
        const user = await this.userModel.findOne({ email })
        if (!user) throw new HttpException({ message: `User with ${email} dont exists` }, HttpStatus.NOT_FOUND)
        await user.populate('metaData')
        await user.populate('profile')
        if (user.metaData.accountStatus == AccountStatus.DELETED) throw new HttpException({ message: `User with ${email} was deleted` }, HttpStatus.NOT_FOUND)
        if (user.metaData.accountStatus == AccountStatus.SUSPENDED) throw new HttpException({ message: `User with ${email} is suspended` }, HttpStatus.FORBIDDEN)

        return user
    }

    async getUserById(id: string) {
        const user = await this.userModel.findOne({ _id: id })
        if (!user) throw new HttpException({ message: `User with ${id} dont exists` }, HttpStatus.NOT_FOUND)
        await user.populate('metaData')
        await user.populate('profile')
        if (user.metaData.accountStatus == AccountStatus.DELETED) throw new HttpException({ message: `User with ${id} was deleted` }, HttpStatus.NOT_FOUND)
        if (user.metaData.accountStatus == AccountStatus.SUSPENDED) throw new HttpException({ message: `User with ${id} is suspended` }, HttpStatus.FORBIDDEN)
        return user
    }

    async getSelfPreferences(id: string) {
        let user = await this.userModel.findById(id);
        if (!user) throw new HttpException({ message: `User ${id} not found`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);
        await user.populate('preference');
        if (!user.preference) {
            const tempPreferences = await this.preferenceModel.create({ userId: user._id, ageRange: { min: 18, max: 55 }, altura: { min: 150, max: 200 } });
            await this.userModel.findByIdAndUpdate(user._id, { preference: tempPreferences._id })
            user = await this.userModel.findById(id);
            await user.populate('preference')
        }
        return user.preference;
    }

    async updateSelfPreferences(id: string, updatePreferenceDto: UpdatePreferenceDto) {
        if (!Object.keys(updatePreferenceDto).length) throw new HttpException({ message: `Nothing to update` }, HttpStatus.BAD_REQUEST);
        const { ageRange, altura, appearance, bodyType, distance, englishLevel, etnicidad, familySituation, language, smoking, typeOfRelationFind } = updatePreferenceDto;
        let user = await this.userModel.findById(id);

        if (!user) throw new HttpException({ message: `User with id ${id} not found` }, HttpStatus.NOT_FOUND);
        await user.populate('preference');
        if (!user.preference) {
            const tempPreferences = await this.preferenceModel.create({ userId: user._id, ageRange: { min: 18, max: 55 }, altura: { min: 150, max: 200 } });
            await this.userModel.findByIdAndUpdate(user._id, { preference: tempPreferences._id })
            user = await this.userModel.findById(id);
            await user.populate('preference')
        }

        if (ageRange) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { ageRange } });
        if (altura) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { altura } });
        if (appearance) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { appearance } });
        if (bodyType) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { bodyType } });
        if (distance) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { distance } });
        if (englishLevel) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { englishLevel } });
        if (etnicidad) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { etnicidad } });
        if (familySituation) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { familySituation } });
        if (language) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { language } });
        if (smoking) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { smoking } });
        if (typeOfRelationFind) await this.preferenceModel.findByIdAndUpdate(user.preference, { $set: { typeOfRelationFind } });

        await user.populate('preference', '-_id -__v')

        return { message: `Preferences updated`, preference: user.preference };
    }

    async seedUsers(many: number) {
        let success = 0, error = 0;
        const errors = []
        const seedUsers = getRandomUsers(many)
        for (let i = 0; i < seedUsers.length; i++) {
            const user = seedUsers[i]
            try {
                const { email, name, password, metaData, preference, profile } = user
                const pass = bycrypt.hashSync(password, bycrypt.genSaltSync())
                const tempUser = await this.userModel.create({ email, name, password: pass })
                const tempMetadata = await this.metaDataModel.create({ userId: tempUser._id, ...metaData })
                const tempProfile = await this.profileModel.create({ userId: tempUser._id, ...profile })
                await this.userModel.findByIdAndUpdate(tempUser._id, { metaData: tempMetadata._id, profile: tempProfile._id })
                if (preference) {
                    const tempPreferences = await this.preferenceModel.create({ userId: tempUser._id, ...preference })
                    await this.userModel.findByIdAndUpdate(tempUser._id, { preference: tempPreferences._id })
                }
                success++
            } catch (e) {
                error++
                errors.push(e)
            }
        }

        return { message: "Seed finished", result: { success, error, errors } }
    }

    async getAllUsers(id: string, getUsersDto: GetUsersDto) {
        const selfUser = await this.userModel.findById(id);
        if (!selfUser) throw new HttpException({ message: `User ${id} not found`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);
        await selfUser.populate('profile', 'geoLocations');
        const selfLocation = selfUser.profile.geoLocations;
        let ageRange: AgeRange = null
        let alturaRange: Altura = null
        const { page, size, age_min, age_max, altura_min, altura_max, appearance, bodyType, englishLevel, etnicidad, familySituation, language, smoking, gender, typeOfRelationFind, distance, sortBy, enviroment } = getUsersDto;

        if ((age_min || age_max) && !(age_min && age_max)) throw new HttpException({ message: 'Age range is invalid .', statusCode: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST)
        if ((age_min && age_max) && (age_max < age_min)) throw new HttpException({ message: 'Age range is invalid ..', statusCode: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST)

        if (age_min && age_max) {
            ageRange = new AgeRange()
            ageRange.min = age_min
            ageRange.max = age_max
        }

        if ((altura_min || altura_max) && !(altura_min && altura_max)) throw new HttpException({ message: 'Altura range is invalid .', statusCode: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST)
        if ((altura_min && altura_max) && (altura_max < altura_min)) throw new HttpException({ message: 'Altura range is invalid ..', statusCode: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST)

        if (altura_min && altura_max) {
            alturaRange = new Altura()
            alturaRange.min = altura_min
            alturaRange.max = altura_max
        }

        const timeDb = process.hrtime();

        const data = await this.userModel.find({}).lean().populate('profile', '-_id -description -__v -socialNetworks').populate('metaData', 'createdAt -_id')

        const timeDbEnd = process.hrtime(timeDb);

        const timeFilter = process.hrtime();


        const dataFiltered = data.reduce((acc, user) => {
            const genderMatch = gender?.length ? gender.includes(user.profile.gender) : true;
            const ageMatch = ageRange ? (getAge(user.profile.birthdate) >= ageRange.min && getAge(user.profile.birthdate) <= ageRange.max) : false;
            const alturaMatch = alturaRange ? (user.profile.altura >= alturaRange.min && user.profile.altura <= alturaRange.max) : false;
            const appearanceMatch = appearance?.length ? appearance.includes(user.profile.appearance) : false;
            const bodyTypeMatch = bodyType?.length ? bodyType.includes(user.profile.bodyType) : false;
            const englishLevelMatch = englishLevel?.length ? englishLevel.includes(user.profile.englishLevel) : false;
            const etnicidadMatch = etnicidad?.length ? etnicidad.includes(user.profile.etnicidad) : false;
            const familySituationMatch = familySituation?.length ? familySituation.includes(user.profile.familySituation) : false;
            const languageMatch = language?.length ? language.includes(user.profile.language) : false;
            const smokingMatch = smoking?.length ? smoking.includes(user.profile.smoking) : false;
            const typeOfRelationFindMatch = typeOfRelationFind?.length ? typeOfRelationFind.includes(user.profile.typeOfRelationFind) : false;
            let userDistance = -1;
            if (selfLocation && user.profile.geoLocations) {
                userDistance = HaverSine(selfLocation.latitude, selfLocation.longitude, user.profile.geoLocations.latitude, user.profile.geoLocations.longitude)
            }
            let distanceMatch = distance ? (userDistance <= distance) : false;
            if (!selfLocation) distanceMatch = false;

            const hasAnyFilter = appearance || bodyType || englishLevel || etnicidad || familySituation || language || smoking || typeOfRelationFind || distance || (alturaRange) || (ageRange);

            const match = genderMatch && (!hasAnyFilter || ageMatch || alturaMatch || distanceMatch || appearanceMatch || bodyTypeMatch || englishLevelMatch || etnicidadMatch || familySituationMatch || languageMatch || smokingMatch || typeOfRelationFindMatch);

            if (match) {
                switch (enviroment) {
                    case Enviroment.DEVELOPMENT:
                        acc.push({
                            ...user
                        });
                    default:
                        acc.push({
                            name: user.name,
                            age: getAge(user.profile.birthdate),
                            photo: user.profile.photos[0] || "",
                            distance: userDistance,
                            profile: { request: user.profile.request },
                            metaData: user.metaData,
                            id: user._id
                        });
                        break;
                }
            }

            return acc;
        }, []);

        if (sortBy == SortBy.NEW) dataFiltered.sort((a, b) => b.metaData.createdAt.getTime() - a.metaData.createdAt.getTime())
        if (sortBy == SortBy.HOT) dataFiltered.sort((a, b) => b.profile.request - a.profile.request)

        const startIndex = (page - 1) * size;
        const endIndex = page * size;

        const paginatedData = dataFiltered.slice(startIndex, endIndex);

        const timeFilterEnd = process.hrtime(timeFilter);

        const metadata = {
            records: dataFiltered.length,
            frame: page,
            frameSize: size,
            lastFrame: Math.ceil(dataFiltered.length / size),
        };

        const dbTimeInMs = (timeDbEnd[0] * 1e3) + (timeDbEnd[1] / 1e6);
        const filterTimeInMs = (timeFilterEnd[0] * 1e3) + (timeFilterEnd[1] / 1e6);

        const timings = {
            db: formatTime(dbTimeInMs),
            filter: formatTime(filterTimeInMs),
        };

        return {
            data: paginatedData,
            metadata,
            ...(enviroment === Enviroment.DEVELOPMENT ? { timings } : {})
        };

    }

    async refreshMatchHot(update: { count: number, to: mongoose.Types.ObjectId, profileID: mongoose.Types.ObjectId }[]) {
        console.log(update);
        const bulkOps = update.map(u => ({
            updateOne: {
                filter: { _id: u.profileID },
                update: {
                    $set: { 'request': u.count }
                }
            }
        }));

        const ids = update.map(u => u.profileID.toString());

        const resetOps = {
            updateMany: {
                filter: { _id: { $nin: ids } },
                update: {
                    $set: { 'request': 0 }
                }
            }
        };

        await this.profileModel.bulkWrite([...bulkOps, resetOps]);
    }

    async getUserProfile(id: string, idInToken: string) {
        const user = await this.userModel.findById(id);
        const selfUser = await this.userModel.findById(idInToken);
        if (!user) throw new HttpException({ message: `User with id ${id} not found` }, HttpStatus.NOT_FOUND);
        if (!selfUser) throw new HttpException({ message: `User with id ${idInToken} not found` }, HttpStatus.NOT_FOUND);
        await user.populate('profile');
        await user.populate('metaData');
        await selfUser.populate('profile');

        const isPremium = await this.paymentService.isPremiumUser(selfUser.inc_id);


        if (user.metaData.accountStatus == AccountStatus.DELETED) throw new HttpException({ message: `User with id ${id} was deleted` }, HttpStatus.NOT_FOUND);
        if (user.metaData.accountStatus == AccountStatus.SUSPENDED) throw new HttpException({ message: `User with id ${id} is suspended` }, HttpStatus.FORBIDDEN);

        const solicitud = await this.matchRequestService.getMatchRequestByFromTo(idInToken, id);
        let distance = -1;
        if (selfUser.profile.geoLocations && user.profile.geoLocations) distance = HaverSine(selfUser.profile.geoLocations.latitude, selfUser.profile.geoLocations.longitude, user.profile.geoLocations.latitude, user.profile.geoLocations.longitude);
        return {
            message: `User with id ${id} profile fetched`, profile: {
                name: user.name,
                altura: user.profile.altura,
                appareanc: user.profile.appearance,
                etnicidad: user.profile.etnicidad,
                age: getAge(user.profile.birthdate),
                bodyType: user.profile.bodyType,
                description: user.profile.description,
                englishLevel: user.profile.englishLevel,
                familySituation: user.profile.familySituation,
                distance,
                language: user.profile.language,
                photos: user.profile.photos,
                ...(user.profile.gender == Gender.MALE ? { profit: user.profile.profit } : {}),
                smoking: user.profile.smoking,
                typeOfRelationFind: user.profile.typeOfRelationFind,
                lastConnection: user.metaData.lastConnection,
                ...(solicitud ? { solicitud: solicitud.status } : {}),
                ...((isPremium && solicitud && solicitud.status == MatchRequestStatus.ACCEPTED) ? { phone: user.profile.phone, networks: user.profile.socialNetworks } : {}),
            }
        };
    }

    async logOut(id: string) {
        const user = await this.userModel.findById(id);
        if (!user) throw new HttpException({ message: `User with id ${id} not found` }, HttpStatus.NOT_FOUND);
        await user.populate('metaData', '+active_session');
        await this.metaDataModel.findByIdAndUpdate(user.metaData, { $set: { active_session: "" } });
    }

    async deleteUser(idInToken: string) {
        const user = await this.userModel.findById(idInToken);
        if (!user) throw new HttpException({ message: `User ${idInToken} not found`, statusCode: HttpStatus.NOT_FOUND }, HttpStatus.NOT_FOUND);
        await user.populate('metaData');
        await this.metaDataModel.findByIdAndUpdate(user.metaData, { $set: { active_session: "" , accountStatus: AccountStatus.DELETED } });
        return {message: 'Account was Deleted'}
    }

    // Complaint
    async createComplaint(createComplaintDto: CreateComplaintDto, idInToken: string) {
        const user = await this.userModel.findById(idInToken);
        if (!user) throw new HttpException({ message: `User with id ${idInToken} not found` }, HttpStatus.NOT_FOUND);

        const subject = await this.userModel.findById(createComplaintDto.subject);
        if (!subject) throw new HttpException({ message: `User with id ${createComplaintDto.subject} not found` }, HttpStatus.NOT_FOUND);

        const complaint = await this.complaintModel.create({ owner: user._id, subjet: subject._id, description: createComplaintDto.description });
        return { message: "Complaint created", id: complaint._id };
    }

    async getAllComplaints(findAllComplaintsDto: FindAllComplaintsDto) {
        const { status, page, size } = findAllComplaintsDto
        const records = await this.complaintModel.countDocuments(status ? { status } : {});

        const complaints = await this.complaintModel.find(status ? { status } : {}).skip((page - 1) * size).limit(size).populate('owner', 'name').populate('subjet', 'name');

        const metadata = {
            records: records,
            frame: page,
            frameSize: size,
            lastFrame: Math.ceil(records / size),
        };

        return {
            data: complaints,
            metadata,
        }
    }

    async updateComplaint(id: string, updateComplaintDto: UpdateComplaintDto) {
        const complaint = await this.complaintModel.findOne({ _id: id });
        const { status } = updateComplaintDto;
        if (!complaint) throw new HttpException({ message: `Complaint with Id ${id}` }, HttpStatus.NOT_FOUND);

        await this.complaintModel.findByIdAndUpdate(id, { $set: { status } });
        return { message: "Complaint updated", id: complaint._id };
    }

    // Stats 
    async getStats() {
        const users = await this.userModel.find({}).select("inc_id");
        const ids = users.map(u => u.inc_id);
        const premiumCount = new Set();
        const allSubscriptions = await this.paymentService.getAllSubscriptions();
        let monthlyMoney = 0;
        for (let i = 0; i < allSubscriptions.length; i++) {
            const subscription = allSubscriptions[i];
            if (subscription.status === "authorized" && ids.includes(subscription.external_reference.toString())) {
                premiumCount.add(subscription.external_reference.toString());
                if (subscription.auto_recurring && subscription.auto_recurring.transaction_amount) {
                    monthlyMoney += subscription.auto_recurring.transaction_amount;
                }
            }
        }
        const history = [];
        try {
            const data = await this.paymentService.Reportes();
            if (data) history.push(...data);
        } catch {
            console.log("Error al obtener los datos")
        }

        return {
            Total: users.length,
            premium: premiumCount.size,
            monthlyMoney,
            history
        }
    }

}


