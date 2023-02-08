import { Args, Int, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';

//_____________________Custom Imports_____________________//
import { Documents } from '../entities/documents.entity';
import { DocumentsService } from '../services/documents.service';
import { CreateDocumentInput } from '../dto/create-document.input';
import { UpdateDocumentInput } from '../dto/update-documet.input';
import { HttpException } from '@nestjs/common/exceptions';

/**
 *  Resolvers For documents
 */

@Resolver((of) => Documents)
export class DocumentsResolver {
  constructor(private readonly  documentService: DocumentsService) {}

  //_____________________Query_____________________//

    /**
   * Summary :   Query For Fetching documents
   * Created By : Akhila U S
   * @returns 
   */
  @Query(() => [Documents],{ name: 'getDocuments' })
  documents(): Promise<Documents[]> {
    return this.documentService.findAll();
  }

  /**
 * Summary :   Query For Fetching documents  by passing id
 * Created By : Akhila U S
 * @param args 
 * @returns 
 */
  @Query((returns) => Documents,{ name: 'getDocumentById' })
  getDocument(@Args('id', { type: () => Int }) id: number): Promise<Documents> {
    return this.documentService.findOne( id );
  }


  

  //_____________________Mutation_____________________//

  



}
