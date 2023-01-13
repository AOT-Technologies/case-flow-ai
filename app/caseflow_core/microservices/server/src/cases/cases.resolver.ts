import { Args, Int, Mutation, Query, Resolver, ResolveReference } from '@nestjs/graphql';

//_____________________Custom Imports_____________________//

import { Cases, casesResponse, } from './cases.entity';
import { CasesService } from './cases.service';
import { CreateCaseInput } from './dto/create-case.input';
import { FetchArgs, FetchCaseDocumentArgs, FetchSearchArgs } from './dto/fetch.input';
import { UpdateCaseInput } from './dto/update-case.input';
import { HttpException } from '@nestjs/common/exceptions';


@Resolver((of) => Cases)
export class CasesResolver {
  constructor(private casesService: CasesService) {}

  //_____________________Query_____________________//

  @Query((returns) => Cases)
  async getCase(@Args() args:FetchCaseDocumentArgs ): Promise<Cases> {
    const res =await this.casesService.findOne(args.id )
    return res;
  }


  @Query((returns) => casesResponse)
  case(@Args() args: FetchArgs): Promise<casesResponse> { 
    const output = this.casesService.findAll(args);     
    return output
  }

  @Query((returns) => casesResponse )
  Searchcase(
    @Args() args: FetchSearchArgs     
     ): Promise<any> | HttpException{

    return this.casesService.searchCase(args.searchField,args.searchColumn,args.skip,args.take);
  }

  @Query((returns) => [Cases])
  fetchRecentCase(): Promise<Cases[]> {
    return this.casesService.findAllWithLimit();
  }

  
  //_____________________Mutation_____________________//

  @Mutation((returns) => Cases)
  createCase(
    @Args('createCaseInput') createCaseInput: CreateCaseInput,
  ): Promise<Cases> {
    return this.casesService.createCase(createCaseInput);
  }

  @Mutation(() => Cases)
  updateCase(@Args('updateCaseInput') updateCaseInput: UpdateCaseInput) {
    return this.casesService.updateCase(updateCaseInput.id, updateCaseInput);
  }

  @Mutation(() => Cases)
  removeCase(@Args('id') id: number) {
    return this.casesService.remove(id);
  }

  @ResolveReference()
    resolverefernce(ref:{__typename:number,id:number}){
    return this.casesService.findOne(ref.id)
    }

}
