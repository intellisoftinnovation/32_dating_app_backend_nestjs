import { HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';

const SECRET_KEY = crypto.randomBytes(32);
const IV_LENGTH = 12;

export class EncryptionService {
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', SECRET_KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return iv.toString('hex') + ':' + encrypted + ':' + authTag;
  }

  static decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new HttpException({ message: 'Invalid encrypted text' }, HttpStatus.BAD_REQUEST)
    }

    try {
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      const authTag = Buffer.from(parts[2], 'hex');

      const decipher = crypto.createDecipheriv('aes-256-gcm', SECRET_KEY, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    }catch (e) {
      throw new HttpException({ message: 'Invalid encrypted text', details: {...e} }, HttpStatus.BAD_REQUEST)
    }
  }
}
