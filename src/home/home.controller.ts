import { PropertyType } from '@prisma/client';
import { HomeService } from './home.service';
import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { log } from 'console';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ) {
    console.log(city);
    console.log(minPrice);
    console.log(maxPrice);
    console.log(propertyType);

    return this.homeService.getHomes();
  }

  @Get(':id')
  getHomeById() {}

  @Post()
  createHome() {
    return {};
  }

  @Put(':id')
  updateHome() {
    return {};
  }

  @Delete()
  deleteHome() {}
}
