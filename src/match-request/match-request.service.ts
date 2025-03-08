import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { MatchRequest, MatchRequestStatus } from './schemas/match-request.schema';
import { Model } from 'mongoose';
import { GetMatchRequestDto, Side } from './dto/get-match-request.dto';

@Injectable()
export class MatchRequestService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService,
        @InjectModel(MatchRequest.name) private readonly matchRequestModel: Model<MatchRequest>,
    ) { }

    async newMatchRequest(idInToken: string, id: string) {
        const from = await this.userService.getUserById(idInToken);
        const to = await this.userService.getUserById(id);
        // TODO: Check if user is preium 

        // const existMatchRequest = await this.matchRequestModel.findOne({ from: from._id, to: to._id });
        // if (existMatchRequest) throw new HttpException({ message: `You already have a match request`}, HttpStatus.AMBIGUOUS);
        // TODO: Validate if match request exist
        const matchRequest = await this.matchRequestModel.create({ from, to });

        this.refreshMatchHot();

        return { message: "Match request created", id: matchRequest._id };
    }

    async getMatchRequest(idInToken: string, getMatchRequestDto: GetMatchRequestDto) {
        const { size, page, side, status } = getMatchRequestDto;
        const tempUser = await this.userService.getUserById(idInToken);

        const matchCondition = {
            ...(side === Side.FROM ? { from: tempUser } : { to: tempUser }),
            ...(status ? { status: status } : {}), // Agregar condición de estado si está presente
        };

        const records = await this.matchRequestModel.countDocuments(matchCondition);
        const requests = await this.matchRequestModel.find(matchCondition)
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
            })
            .skip((page - 1) * size)
            .limit(size);

        const metadata = {
            records: records,
            frame: page,
            frameSize: size,
            lastFrame: Math.ceil(records / size),
        };

        return {
            data: requests,
            metadata,
        }
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
        const matchRequest = await this.matchRequestModel.findById(id);
        if (!matchRequest) throw new HttpException({ message: `Match request with id ${id} not found` }, HttpStatus.NOT_FOUND);

        if (matchRequest.to.toString() != idInToken) throw new HttpException({ message: `You cant update match request with id ${id} ` }, HttpStatus.FORBIDDEN);

        matchRequest.status = status;
        await matchRequest.save();

        return { message: `Match request with id ${id} updated` };
    }

    async getMatchRequestByFromTo(from: string, to: string) {
        const matchRequest = await this.matchRequestModel.findOne({ from: from, to: to });
        return matchRequest;
    }

}
