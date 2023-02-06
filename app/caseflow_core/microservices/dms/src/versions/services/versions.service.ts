import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, Version } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVersionInput } from '../dto/create-version.input';
import { UpdateVersionInput } from '../dto/update-version.input';
import { Versions } from '../entities/version.entity';

@Injectable()
export class VersionsService {

  constructor(
    @InjectRepository(Versions) private verisonRepository: Repository<Versions>,
  ) {}


   /**
   * Create Method For Creating New versions
   * @param createVersionInput
   * @returns
   */
  // @Roles({ roles: ['manage-account'], mode: RoleMatchingMode.ANY })
  async create(createVersionInput: CreateVersionInput): Promise<Versions> {
    try {
      const newVersion = this.verisonRepository.create(createVersionInput);
      return this.verisonRepository.save(newVersion);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Find All Method for Returning All versions
   * @param args
   * @returns
   */
   async findAll(): Promise<Versions[]> {
    try {
    return this.verisonRepository.find({relations:["documents"], order: {
      id: "DESC",
     }});
  } catch (err) {
    console.log(err);
  }
  }

  /**
   * Find One Method For Returning Specific Versions
   * @param id 
   * @returns 
   */
   async findOne(id: number): Promise<Versions> {
    try {
    if (id) {
      const value = await this.verisonRepository.findOne({
        where: {
          id: id,
        },
        
        relations: [
          'documents',
        ],
        order: {
          id: "DESC",
         }
        
      });
      console.log(value);
      if (value) return value;

      throw new NotFoundException(`Record cannot find by id ${id}`);
    }
    throw new BadRequestException("request doesn't have any id");
  } catch (err) {
    console.log(err);
  }
  }

   /**
   * Find One Method For Returning Specific Versions
   * @param id 
   * @returns 
   */
    async findDocument(id: number): Promise<Versions> {
      try {
      if (id) {
        const value = await this.verisonRepository.findOne({
          where: {
            docid: id,
          },
          relations: [
            'documents',
          ],
          order: {
            id: "DESC",
           }
          
        });
        console.log(value);
        if (value) return value;
  
        console.log(`Record cannot find by id ${id}`);
      }
      console.log("request doesn't have any id");
    } catch (err) {
      console.log(err);
    }
    }
  

  /**
   *  Update Versions
   * @param id 
   * @param updateVersionInput 
   * @returns 
   */
  // async update(id: number, updateVersionInput: UpdateVersionInput) {
  //   try {
  //   return await this.verisonRepository.update(id, updateVersionInput).then(() => {
  //     return this.findOne(id).catch((err) => {
  //       throw new HttpException(err.response, HttpStatus.NOT_FOUND);
  //     });
  //   });
  // } catch (err) {
  //   console.log(err);
  // }
  // }

  remove(id: number) {
    return `This action removes a #${id} version`;
  }
}
