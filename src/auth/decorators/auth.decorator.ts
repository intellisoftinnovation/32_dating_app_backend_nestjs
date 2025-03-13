import { applyDecorators, UseGuards } from "@nestjs/common"
import { ItPrivileges } from "../interfaces/ItPrivileges"
import { AuthGuard } from "@nestjs/passport"
import { UserPrivilegesGuard } from "../guards/user-privileges.guard"
import { PrivilegesProtected } from "./privileges-protected.decorator"
import {  ApiResponse, ApiSecurity } from "@nestjs/swagger"

export const Auth = (...privileges: ItPrivileges[]) => {
    return applyDecorators(
        ApiSecurity('token'),
        ApiResponse({ status: 401 }),
        ApiResponse({ status: 400 }),
        ApiResponse({ status: 403 }),
        ApiResponse({ status: 406 , description:"This session is closed."}),
        PrivilegesProtected(...privileges),
        UseGuards(AuthGuard(), UserPrivilegesGuard)
    )
}

