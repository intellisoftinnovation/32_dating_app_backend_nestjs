import { HttpStatus } from "@nestjs/common"
import { extensions } from "./extensions.type"
// express.d.ts

export const fileFilterImg = (req: Express.Request, file: Express.Multer.File, callback: any) => {

    const fileExtension  = file.mimetype.split('/')[1]
    if(!extensions.image.includes( fileExtension)){
        req.errors = {
            message: `${fileExtension} format not supported, try ${extensions.image}`,
            status: HttpStatus.BAD_REQUEST
        }
        return callback(null, false)
    }
    callback(null, true)
}