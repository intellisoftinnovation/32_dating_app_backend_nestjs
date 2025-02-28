import { SetMetadata } from "@nestjs/common";
import { ItPrivileges } from "../interfaces/ItPrivileges";


export const META_PRIVILEGES = 'privileges';


export const PrivilegesProtected = (...args: ItPrivileges[]) => {
    return SetMetadata(META_PRIVILEGES, args);
}