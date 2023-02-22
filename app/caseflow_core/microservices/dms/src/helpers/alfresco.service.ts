import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService} from '@nestjs/config';
import axios, {AxiosResponse} from 'axios'
import { createReadStream } from 'fs';
import { firstValueFrom, map, Observable } from 'rxjs';

const FormData = require('form-data');
@Injectable()
export class AlfrescoService {
  constructor(private readonly configService: ConfigService,private readonly httpService: HttpService) {}

  // Summary : Upload File to Alfresco
  // Created By : Don C Varghese
  async uploadDocument(file: any, data: any,token:string):  Promise<any>  {
   console.log(file,data);
   let body = await this.mapAlfrescoForm(file,data)
   const headersRequest = {
    'Content-Type': 'multipart/form-data',
    "Authorization": token ,
};
    const url = this.configService.get('ALFRESCO_REPO_URL') + "/1/nodes/-root-/children"
    try{
      let response = await firstValueFrom(this.httpService.post(url,body,{
        headers : headersRequest
      
      }));
      return response.data;
    }
    catch(err){
 console.log(err);
    }
   
   
  }

  // Summary : Upload File to Alfresco
  // Created By : Don C Varghese
  async updateDocument(file: any,documnet : any,data: any,token:string):  Promise<any>  {
   console.log(file,data);
   let body = new Buffer(file.buffer ? file.buffer : file);
   const headersRequest = {
    "Authorization": token ,
};

    const url = this.configService.get('ALFRESCO_REPO_URL') + "/1/nodes/" + documnet.documentref + '/content'
  const params =  {
    "name" : data.name,
    "cm:description" : data.desc
  }
    try{
      let response = await firstValueFrom(this.httpService.put(url,body,{
        
        headers : headersRequest,
        params: params,
      
      }));
      console.log("response",response)
      return response;
    }
    catch(err){
 console.log(err);
    }
   
   
  }

    // Summary : Get  File from afresco
  // Created By : Don C Varghese
  async getDocument(documentId: string,token:string): Promise<any> {
    try{
       const url = this.configService.get('ALFRESCO_REPO_URL') + "/1/nodes/"+ documentId +"/content?attachment=false"
    return axios.get(url, {
      headers : {"Authorization": token },
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary'))
    }
    catch(err){
    console.log(err);
    }

    
  }

    // Summary : Delete  File from afresco
  // Created By : Don C Varghese
  async deleteDocument(documentId: string,token:string): Promise<any> {
    try{
      const headersRequest = {
        "Authorization": token 
    };
      const url = this.configService.get('ALFRESCO_REPO_URL') + "/1/nodes/"+ documentId +"?permanent=false"
      let response = await firstValueFrom(this.httpService.delete(url,{
        headers : headersRequest
      
      }));
      console.log("response",response)
      return response;
    }
    catch(err){
    console.log(err);
    }

    
  }

  // Summary : Map Alfresco details
  // Created By : Don C Varghese
  mapAlfrescoForm(file,data) {
    try{
      let fileData = new Buffer(file.buffer ? file.buffer : file)
      const form = new FormData();
      form.append('filedata', fileData, data?.name);
      form.append('name', data?.name);
      form.append('nodeType', 'cm:content');
      form.append('cm:title', data?.name);
      form.append('cm:description', data?.desc);
      form.append('relativePath', this.configService.get('ALFRESCO_RELATIVE_PATH'))
      return form;
  } catch (err) {
    console.log(err);
  }
  }
}
