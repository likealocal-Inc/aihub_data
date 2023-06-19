import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PoiModule } from './poi/poi.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PoiModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
