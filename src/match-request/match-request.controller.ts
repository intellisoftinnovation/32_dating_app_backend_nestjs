import { Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { MatchRequestService } from './match-request.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { GetMatchRequestDto } from './dto/get-match-request.dto';
import { MatchRequestStatus } from './schemas/match-request.schema';
import { ApiQuery } from '@nestjs/swagger';

@Controller('match-request')
export class MatchRequestController {
  constructor(private readonly matchRequestService: MatchRequestService) {}

  @Post('/:id')
  @Auth()
  async newMatchRequest(@Param('id') id: string , @GetUser('id') idInToken: string ) {
    return this.matchRequestService.newMatchRequest(idInToken, id);
  }

  @Get()
  @Auth()
  async getMatchRequest(@GetUser('id') idInToken: string, @Query() getMatchRequestDto: GetMatchRequestDto) {
    return this.matchRequestService.getMatchRequest(idInToken, getMatchRequestDto);
  }

  @Patch(':id')
  @Auth()
  @ApiQuery({
    enum: MatchRequestStatus,
    name: 'status',
    required: true,
    description: 'Status of the match request'
  })
  async updateMatchRequest(@Param('id') id: string , @GetUser('id') idInToken: string, @Query('status') status: MatchRequestStatus) {

    if(!status) throw new HttpException({ message: `Invalid status` , details:` status must be one of following values ${Object.values(MatchRequestStatus)}`  }, HttpStatus.BAD_REQUEST); //TODO: Move this into DTO and make this of excelent mode

    return this.matchRequestService.updateMatchRequest(id , idInToken, status);
  }

}
