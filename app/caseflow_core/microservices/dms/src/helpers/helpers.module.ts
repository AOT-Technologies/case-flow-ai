import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
//_____________________Custom Imports_____________________//
import { TransformService } from './transform.service';
import { AmazonS3Service } from './amazon-s3.service';
import { FileService } from './file.service';
import { AlfrescoService } from './alfresco.service';
import { SharepointServices } from './sharepoint.service';
import { AuthService } from './auth.service';


@Module({
  imports:[HttpModule],
  providers: [
    TransformService,
    AmazonS3Service,
    ConfigService,
    FileService,
    AlfrescoService,
    SharepointServices,
    AuthService
  ],
  exports: [TransformService, AmazonS3Service, FileService,AlfrescoService,SharepointServices,AuthService],
})
export class HelpersModule {}
