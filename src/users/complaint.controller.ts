import { Body, Controller, Post} from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { UsersService } from "./users.service";
import { CreateComplaintDto } from "./dto/create-complaint.dto";
import { RateLimit } from "src/common/decorators/rate-limit.decorator";


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
  
}


