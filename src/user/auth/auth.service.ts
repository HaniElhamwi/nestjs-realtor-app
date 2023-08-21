import { PrismaService } from './../../prisma/prisma.service';
import { ConflictException, Injectable, HttpException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SigninParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signup(
    { email, password, name, phone }: SignupParams,
    useType: UserType,
  ) {
    const userExits = await this.prismaService.user.findUnique({
      where: {
        email: `${email}`,
      },
    });
    if (userExits) {
      throw new ConflictException();
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const user = await this.prismaService.user.create({
        data: {
          email,
          password: hashPassword,
          name,
          user_type: useType,
          phone,
        },
      });

      const token = await this.generateJWT(user.name, user.id);
      return token;
    }
  }

  async singin({ email, password }: SigninParams) {
    console.log('its isining in');
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid creaedntials', 400);
    } else {
      const hashedPassword = user.password;
      const isValidPassword = await bcrypt.compare(password, hashedPassword);
      if (!isValidPassword) {
        throw new HttpException('Password Is Invalid', 400);
      }
      const jwt = await this.generateJWT(user.name, user.id);
      return jwt;
    }
  }

  private async generateJWT(name: string, id: number) {
    return await jwt.sign(
      {
        name: name,
        id: id,
      },
      process.env.JSON_TOKEN_KEY,
      {
        expiresIn: 3600000,
      },
    );
  }

  async generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCTS_KEY_SECRET}`;

    return bcrypt.hash(string, 10);
  }
}
