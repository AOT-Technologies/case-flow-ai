import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//_____________________Custom Imports_____________________//
import { TransformService } from './transform.service';

@Module({
  providers: [TransformService, ConfigService],
  exports: [TransformService],
})
export class HelpersModule {}
