import { Controller, Get } from '@nestjs/common';
import { PoiService } from './poi.service';

@Controller('poi')
export class PoiController {
  constructor(private readonly poiService: PoiService) {}

  @Get('origin')
  findAll() {
    return this.poiService.mappingOrigin();
  }
}
