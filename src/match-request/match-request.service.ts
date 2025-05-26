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
        @InjectModel('User') private readonly userModel: Model<any>,
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
            }).sort({ createdAt: -1 });

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

    async updateMatchRequest(fromUserId: string, toUserId: string, status: MatchRequestStatus) {
        let err = null;
        let fcm = null;
        // Find the match request where 'from' is fromUserId and 'to' is toUserId (the authenticated user)
        const matchRequest = await this.matchRequestModel.findOne({ from: fromUserId, to: toUserId });

        if (!matchRequest) {
            throw new HttpException(
                { message: `Match request from user ${fromUserId} to user ${toUserId} not found` },
                HttpStatus.NOT_FOUND
            );
        }

        // The check 'matchRequest.to.toString() != toUserId' is implicitly handled by the findOne query,
        // but can be kept for explicit safety if desired, though it would be redundant here.

        matchRequest.status = status;
        await matchRequest.save();

        try {
            if (matchRequest.status === MatchRequestStatus.ACCEPTED) {
                // Assuming 'from' user's profile and fcmToken are populated or accessible
                // If matchRequest.from is just an ID, you might need to populate it first: await matchRequest.populate('from.profile');
                const senderUser = await this.userModel.findById(matchRequest.from).select('profile.fcmToken').exec();
                
                if (senderUser && senderUser.profile && senderUser.profile.fcmToken) {
                  fcm = await this.firebaseAdminService.sendNotificationToDevice(
                    senderUser.profile.fcmToken, 
                    { title: "🔥 ¡Es un match!", body: "Tu solicitud fue aceptada. Es hora de romper el hielo y empezar la conversación." }
                  );
                } else {
                  console.log(`FCM token not found for user ${matchRequest.from.toString()} to send match acceptance notification.`);
                }
            }
        } catch (error) {
            err = error;
            console.log('Error sending FCM notification for match acceptance:', error);
        }

        return { message: `Match request with id ${matchRequest._id} updated successfully`, fcm, err };
    }

    async getMatchRequestByFromTo(from: string, to: string) {
        const matchRequest = await this.matchRequestModel.findOne({ from: from, to: to });
        return matchRequest;
    }

    async getMatchRequestByFromName(from: string, name: string, params: { side: Side }) {
        const { side } = params;
        if (side === Side.FROM) {
            const matchRequest = await this.matchRequestModel.find({ from: from }).populate('to', 'name');
            return matchRequest.filter(item => item.to.name.toLowerCase().includes(name.toLowerCase()));
        } else {
            const matchRequest = await this.matchRequestModel.find({ to: from }).populate('from', 'name');
            return matchRequest.filter(item => item.from.name.toLowerCase().includes(name.toLowerCase()));
        }
    }


    async test(target: string) {
        return this.firebaseAdminService.sendNotificationToDevice(target, { title: "Test", body: "Test" });
    }

}
