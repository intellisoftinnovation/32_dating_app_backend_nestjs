// files.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StorageService {
    async uploadFile(path: string, file: Express.Multer.File): Promise<string> {
        try {
            // Asegúrate de que el directorio de destino exista
            await fs.mkdir(path, { recursive: true });

            // Construye la ruta completa del archivo

            const fileName = `${uuid()}.${file.mimetype.split('/')[1]}`
            const filePath = join(path, fileName);

            // console.log(filePath);

            // Guarda el archivo en la ruta especificada
            await fs.writeFile(filePath, file.buffer);

            return fileName; // Devuelve el nombre del archivo guardado :) 
        } catch (error) {
            throw new HttpException({ message: `We couldn't upload the file: ${error.message} .^` }, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    async deleteFile(filePath: string): Promise<void> {
        try {
            // Elimina el archivo especificado
            await fs.unlink(filePath);
        } catch (error) {
            throw new HttpException({ message: `We couldn't delete the file: ${error.message} .^` }, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    async replaceFile(path: string, fileName: string, newFile: Express.Multer.File): Promise<string> {
        try {
            // Construye la ruta completa del archivo a reemplazar
            const filePath = join(path, fileName);

            await this.deleteFile(filePath)
            return await this.uploadFile(path, newFile)

        } catch (error) {
            throw new HttpException({ message: `We couldn't replace the file: ${error.message} .^` }, HttpStatus.SERVICE_UNAVAILABLE);
        }
    }
}
