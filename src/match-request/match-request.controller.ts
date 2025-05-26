import { Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { MatchRequestService } from './match-request.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { GetMatchRequestDto, Side } from './dto/get-match-request.dto';
import { MatchRequestStatus } from './schemas/match-request.schema';
import { ApiQuery } from '@nestjs/swagger';
import { UpdateMatchRequestQueryDto } from './dto/update-match-request.dto';

@Controller('match-request')
export class MatchRequestController {
  constructor(private readonly matchRequestService: MatchRequestService) { }

  @Post('/:id')
  @Auth()
  async newMatchRequest(@Param('id') id: string, @GetUser('id') idInToken: string) {
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
  async updateMatchRequest(@Param('id') id: string, @GetUser('id') idInToken: string, @Query() query: UpdateMatchRequestQueryDto) {

    return this.matchRequestService.updateMatchRequest(id, idInToken, query.status);
  }

  @Get('/name/:name')
  @ApiQuery({
    enum: Side,
    name: 'side',
    required: true,
    description: 'Side of the match request'
  })
  @Auth()
  async getMatchRequestByName(@GetUser('_id') from: string, @Param('name') name: string, @Query() params: { side: Side }) {
    return this.matchRequestService.getMatchRequestByFromName(from, name, params);
  }

  // @Post('test/:target')
  // async test(@Param('target') target: string) {
  //   return this.matchRequestService.test(target);
  // }

}
