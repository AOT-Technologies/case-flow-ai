import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

//_____________________Custom Imports_____________________//

import { DmsController } from './dms.controller';
import { DmsService } from './dms.service';

@Module({
  controllers: [DmsController],
  providers: [DmsService],
  imports: [
    ClientsModule.register([
      {
        name: 'DMS',
        transport: Transport.TCP,
        
        options: { host : "35.182.42.147", port: 7003 },
      },
    ]),
  ],
})
export class DmsModule {}
