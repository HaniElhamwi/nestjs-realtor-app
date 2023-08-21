import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes() {
    return await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedroom: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      where: {
        city: 'gaziantep\n',
        price: {
          gte: 3430,
          lte: 6000,
        },
      },
    });
  }
}
