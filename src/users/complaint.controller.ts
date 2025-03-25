import { Body, Controller, Get, Param, Patch, Post, Query} from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { UsersService } from "./users.service";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { RateLimit } from "src/common/decorators/rate-limit.decorator";
import { FindAllComplaintsDto } from "./dto/find-all-complaint.dto";
import { ItPrivileges } from "src/auth/interfaces/ItPrivileges";
import { UpdateComplaintDto } from "./dto/update-complaint.dto";


@Controller('complaint')
export class ComplaintController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post('new')
  @Auth()
  @RateLimit(1, 60*1000)
  async createComplaint(@Body() createComplaintDto: CreateComplaintDto, @GetUser('_id') idInToken: string) {
    return await this.usersService.createComplaint(createComplaintDto, idInToken);
  }


  @Get('all')
  @Auth(ItPrivileges.ALL_PRIVILEGES)
  async getAllComplaints(@Query() findAllComplaintsDto: FindAllComplaintsDto) {
    return await this.usersService.getAllComplaints(findAllComplaintsDto);
  }


  @Patch(':id')
  @Auth(ItPrivileges.ALL_PRIVILEGES)
  async updateComplaint(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto) {
    return await this.usersService.updateComplaint( id , updateComplaintDto);
  }
  
}


