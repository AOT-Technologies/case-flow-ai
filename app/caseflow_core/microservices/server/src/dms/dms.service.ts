import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class DmsService {
  constructor(@Inject('DMS') private readonly dmsClient: ClientProxy) {}

  async fetchDocument(data,headers): Promise<any> {
    let response = await this.dmsClient.send({ cmd: 'fetch_document' }, { ...data,...headers }).toPromise();
    return response;
  }

  uploadDocument(file, data,headers): any {
    return this.dmsClient.send({ cmd: 'create_document' }, { file, ...data,...headers });
  }

  editDocument(file, data,headers): any {
    return this.dmsClient.send({ cmd: 'edit_document' }, { file, ...data,...headers });
  }

  deleteDocument(data,headers): any {
    return this.dmsClient.send({ cmd: 'delete_document' }, { ...data,...headers });
  }
}
