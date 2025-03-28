import { Controller, Get } from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ItPrivileges } from "src/auth/interfaces/ItPrivileges";
import { UsersService } from "./users.service";

@Controller('stats')
export class StatsController {
    constructor(private readonly userService: UsersService) {
    }

    @Auth(ItPrivileges.ALL_PRIVILEGES)
    @Get()
    async getStats() {
        return await this.userService.getStats();
    }
}