import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//_____________________Custom Imports_____________________//
import { DocumentsService } from './services/documents.service';
import { DocumentsResolver } from './resolvers/documents.resolver';
import { Documents } from './entities/documents.entity';
import { DocumentsController } from './documents.controller';
import { HelpersModule } from '../helpers/helpers.module';
import { VersionsModule } from 'src/versions/versions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Documents]), HelpersModule,VersionsModule],
  providers: [DocumentsService, DocumentsResolver],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
