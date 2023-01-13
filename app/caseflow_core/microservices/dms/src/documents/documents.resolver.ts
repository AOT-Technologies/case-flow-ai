import { Args, Int, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';

//_____________________Custom Imports_____________________//
import { CaseDocuments } from './documents.entity';
import { DocumentsService } from './documents.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-documet.input';
import { HttpException } from '@nestjs/common/exceptions';


@Resolver((of) => CaseDocuments)
export class DocumentsResolver {
  constructor(private readonly  documentService: DocumentsService) {}

  //_____________________Query_____________________//

  @Query(() => [CaseDocuments],{ name: 'documents' })
  documents(): Promise<CaseDocuments[]> {
    return this.documentService.findAll();
  }
  @Query((returns) => [CaseDocuments])
  getCaseDocument(@Args('id', { type: () => Int }) id: number): Promise<CaseDocuments> {
    return this.documentService.findOne( id );
  }

  @Query((returns) => [CaseDocuments] )
  SearchcaseDocument(
    @Args('searchField') searchField: string,
    @Args('searchColumn') searchColumn : string,
     ): Promise<CaseDocuments[]> | HttpException{

    return this.documentService.searchCaseDocument(searchField,searchColumn);
  }

  //_____________________Mutation_____________________//

  @Mutation((returns) => CaseDocuments)
  createDocument(
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput,
  ): Promise<CaseDocuments> {
    return this.documentService.createDocument(createDocumentInput);
  }

  @Mutation(() => CaseDocuments)
  updateDocument(@Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput) {
    return this.documentService.update(updateDocumentInput.id, updateDocumentInput);
  }

  @Mutation(() => CaseDocuments)
  removeDocument(@Args('id') id: number) {
    return this.documentService.remove(id);
  }

  @ResolveField((of)=>CaseDocuments)
  cases(@Parent() document:CaseDocuments){
    return {__typename:"Cases",id:document.caseId}
  }

}