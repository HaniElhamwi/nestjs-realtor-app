import {
  Body,
  Controller,
  Post,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, SigninDto, GenerateProductsKeyDto } from './dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productsKey) {
        throw new UnauthorizedException();
      }
      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCTS_KEY_SECRET}`;

      const isValidProductKey = await bcrypt.compare(
        validProductKey,
        body.productsKey,
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }
    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.singin({
      email: body.email,
      password: body.password,
    });
  }

  @Post('/key')
  generateProductKey(@Body() body: GenerateProductsKeyDto) {
    return this.authService.generateProductKey(body.email, body.userType);
  }
}
