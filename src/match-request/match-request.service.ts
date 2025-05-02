import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { MatchRequest, MatchRequestStatus } from './schemas/match-request.schema';
import { Model } from 'mongoose';
import { GetMatchRequestDto, Side } from './dto/get-match-request.dto';
import { PaymentService } from 'src/payment/payment.service';
import { FirebaseAdminService } from 'src/helpers/firebase-admin.service';

@Injectable()
export class MatchRequestService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService,
        @Inject(forwardRef(() => PaymentService)) private readonly paymentService: PaymentService,
        @InjectModel(MatchRequest.name) private readonly matchRequestModel: Model<MatchRequest>,
        @Inject(FirebaseAdminService) private readonly firebaseAdminService: FirebaseAdminService
    ) { }

    async newMatchRequest(idInToken: string, id: string) {
        let err = null;
        let fcm = null;
        const from = await this.userService.getUserById(idInToken);
        const to = await this.userService.getUserById(id);
        const isPremium = await this.paymentService.isPremiumUser(from.inc_id);

        if (!isPremium) throw new HttpException({ message: `You need to be a premium user to make a match request` }, HttpStatus.PAYMENT_REQUIRED);
        const matchRequest = await this.matchRequestModel.create({ from, to });
        try {
            fcm = await this.firebaseAdminService.sendNotificationToDevice(to.profile.fcmToken, { title: "✨ Alguien quiere conocerte", body: "Te llegó una solicitud de match. ¿Le das una oportunidad o lo dejas en visto?" });
        } catch (error) {
            err = error;
            console.log(error)
        }

        this.refreshMatchHot();

        return { message: "Match request created", id: matchRequest._id, err, fcm };
    }

    async getMatchRequest(idInToken: string, getMatchRequestDto: GetMatchRequestDto) {
        const { size, page, side, status, offPagination } = getMatchRequestDto;
        const tempUser = await this.userService.getUserById(idInToken);

        const matchCondition = {
            ...(side === Side.FROM ? { from: tempUser } : { to: tempUser }),
            ...(status ? { status: status } : {}),
        };

        const records = await this.matchRequestModel.countDocuments(matchCondition);

        // Construye la consulta base
        let query = this.matchRequestModel.find(matchCondition)
            .populate({
                path: 'from',
                select: "name",
                populate: {
                    path: 'profile',
                    select: "photos"
                },
            })
            .populate({
                path: 'to',
                select: "name",
                populate: {
                    path: 'profile',
                    select: "photos"
                },
            });

        // Solo aplica paginación si offPagination no es true
        if (!offPagination) {
            query = query.skip((page - 1) * size).limit(size);
        }

        const requests = await query;

        const metadata = {
            records,
            frame: page,
            frameSize: size,
            lastFrame: Math.ceil(records / size),
        };

        return {
            data: requests,
            metadata,
        };
    }


    async refreshMatchHot() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const result = await this.matchRequestModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                },
            },
            {
                $group: {
                    _id: "$to",
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo",
                },
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $project: {
                    _id: 0,
                    to: "$_id",
                    count: 1,
                    profileID: "$userInfo.profile",
                },
            },
        ]);
        this.userService.refreshMatchHot(result);
        return result;
    }

    async updateMatchRequest(id: string, idInToken: string, status: MatchRequestStatus) {
        let err = null;
        let fcm = null;
        const matchRequest = await this.matchRequestModel.findById(id);
        if (!matchRequest) throw new HttpException({ message: `Match request with id ${id} not found` }, HttpStatus.NOT_FOUND);

        if (matchRequest.to.toString() != idInToken) throw new HttpException({ message: `You cant update match request with id ${id} ` }, HttpStatus.FORBIDDEN);

        matchRequest.status = status;
        await matchRequest.save();

        try {
            if (matchRequest.status === MatchRequestStatus.ACCEPTED) {
                fcm = await this.firebaseAdminService.sendNotificationToDevice(matchRequest.from.profile.fcmToken, { title: "🔥 ¡Es un match!", body: "Tu solicitud fue aceptada. Es hora de romper el hielo y empezar la conversación." });
            }
        } catch (error) {
            err = error;
            console.log(error)
        }


        return { message: `Match request with id ${id} updated`, fcm, err };
    }

    async getMatchRequestByFromTo(from: string, to: string) {
        const matchRequest = await this.matchRequestModel.findOne({ from: from, to: to });
        return matchRequest;
    }


    async test(target: string) {
        return this.firebaseAdminService.sendNotificationToDevice(target, { title: "Test", body: "Test" });
    }

}
