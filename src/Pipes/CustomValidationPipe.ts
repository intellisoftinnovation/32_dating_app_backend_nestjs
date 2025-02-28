import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const errorMessages = errors.map(error => {
          const constraints = error.constraints;
          const property = error.property || "";
          const paths = property.split('.');
          return {
            property,
            paths,
            constraints,
            childrens: error.children
          };
        });
        return new BadRequestException({ message: 'Validation Error', errors: errorMessages });
      },
    });
  }

  transformException(errors: ValidationError[]) {
    const errorMessages = errors.map(error => {
      const constraints = error.constraints;
      const property = error.property || "";
      const paths = property.split('.');
      return {
        property,
        paths,
        constraints,
        childrens: error.children
      };
    });
    return new BadRequestException({ message: 'Validation Error', errors: errorMessages });
  }
}