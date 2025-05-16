import { createParamDecorator, HttpException, HttpStatus } from "@nestjs/common";

/**
 * Get user from request
 * @param data
 * @returns if data is provided, returns user[data] else returns user
 */
export const GetUser = createParamDecorator((data, ctx) => {

  const { user } = ctx.switchToHttp().getRequest();
  if(!user) throw new HttpException({message:'Internal Server Error :/', details: 'User not found'}, HttpStatus.INTERNAL_SERVER_ERROR);

  return data ? user[data] :  user;

});
