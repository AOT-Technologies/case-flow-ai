import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//_____________________Custom Imports_____________________//
import { CreateDocumentInput } from './dto/create-document.input';
import { CaseDocuments } from './documents.entity';
import { UpdateDocumentInput } from './dto/update-documet.input';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(CaseDocuments)
    private documentRepository: Repository<CaseDocuments>,
  ) {}

  // summery : Get all documents
  // Created By : Don C Varghese
  async findAll(): Promise<CaseDocuments[]> {
    return this.documentRepository.find();
  }

  // summery : Create a new document
  // Created By : Don C Varghese
  async createDocument(
    createDocumentInput: CreateDocumentInput,
  ): Promise<CaseDocuments> {
    try {
      const newCase = this.documentRepository.create(createDocumentInput);
      return this.documentRepository.save(newCase);
    } catch (err) {
      console.log(err);
    }
  }

  // summery : Select  single document
  // Created By : Don C Varghese
  async findOne({ id }: { id: number }): Promise<CaseDocuments> {
    return this.documentRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  // summery : Update a new document
  // Created By : Don C Varghese
  async update(id: number, updateCaseInput: UpdateDocumentInput) {
    let cases: CaseDocuments = this.documentRepository.create(updateCaseInput);
    cases.id = id;
    return this.documentRepository.save(cases);
  }

  // summery : Delete a new document
  // Created By : Don C Varghese
  async remove(id: number) {
    let caseData = this.documentRepository.findOne({
      where: {
        id: id,
      },
    });
    if (caseData) {
      let ret = await this.documentRepository.delete(id);
      if (ret.affected === 1) {
        return caseData;
      }
    }
    throw new NotFoundException(`Record cannot find by id ${id}`);
  }
}
