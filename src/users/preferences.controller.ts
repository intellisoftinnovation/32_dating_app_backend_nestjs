import { Body, Controller, Get, Patch } from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { UsersService } from "./users.service";
import { UpdatePreferenceDto } from "./dto/update-preferences.dto";

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get('self')
  @Auth()
  async getSelfPreferences(@GetUser('_id') idInToken: string) {
    return await this.usersService.getSelfPreferences(idInToken);
  }

  @Patch('self')
  @Auth()
  async updateSelfPreferences(@Body() updatePreferenceDto: UpdatePreferenceDto, @GetUser('_id') idInToken: string) {
    return await this.usersService.updateSelfPreferences(idInToken, updatePreferenceDto);
  }


}


