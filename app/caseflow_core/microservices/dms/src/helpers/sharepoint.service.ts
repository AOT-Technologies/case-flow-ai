import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
// import queryString from 'query-string';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios/dist';
import { firstValueFrom, lastValueFrom, observable, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

//Created By:Gokul VG
//Summary: Sharepoint Rest API services Upload,Update,Delete,Download

@Injectable()
export class SharepointServices{
    constructor(private readonly configService: ConfigService,private readonly httpService:HttpService){}

  // Summary : Update File to Sharepoint
  // Created By :Gokul VG
   async uploadDocument(file,fileName):Promise<any>{  
            const spURL = `https://aottech.sharepoint.com/sites/Caseflow/_api/web/GetFolderByServerRelativeUrl('/sites/Caseflow/Caseflow')/Files/Add(url='${fileName}', overwrite=true)`
            try {     
                const accessToken =await this.getAccessToken(); 
                const FormDigestValue= await this.getFormDigestValue()  
                const responseUpload = await firstValueFrom(this.httpService.post(spURL,file,{
                    maxBodyLength:Infinity,
                    maxContentLength:Infinity,                    
                    headers:{
                        "Authorization":`Bearer ${accessToken}`,
                        'X-RequestDigest': `${FormDigestValue}`
                    }
                }))
              return responseUpload.data    
            } catch (e) {
              console.log(e)
            }         
    }    

  // Summary : fetch  File from Sharepoint
  // Created By :Gokul VG
    async getDocument (fileName:any):Promise<any>{
        const spURL = `https://aottech.sharepoint.com/sites/Caseflow/_api/web/GetFileByServerRelativeUrl('/sites/Caseflow/Caseflow/${fileName}')/$value`
        try {    
            const accessToken =await this.getAccessToken();           
            const responseUpload = await firstValueFrom(this.httpService.get(spURL,{
                headers:{
                    "Authorization":`Bearer ${accessToken}`,                   
                }
            }))          
           
          return responseUpload.data.buffer;
        } catch (e) {
          console.log(e)

        }       
    }

  // Summary : delete  File from Sharepoint
  // Created By :Gokul VG
    async deleteDocument (fileName:any):Promise<any>{
            const spURL = `https://aottech.sharepoint.com/sites/Caseflow/_api/web/GetFileByServerRelativeUrl('/sites/Caseflow/Caseflow/${fileName}')`           
            try {   
                const accessToken = await this.getAccessToken();
                const FormDigestValue =await this.getFormDigestValue()               

                const responseUpload = await firstValueFrom(this.httpService.delete(spURL,{ 
                    headers:{
                        "Authorization":`Bearer ${accessToken}`,
                        // 'X-RequestDigest': `${FormDigestValue}`,
                        "X-HTTP-Method":"DELETE",
                        "Accept": "application/json;odata=verbose",
                        "IF-MATCH": "*"                        

                    }
                }))                            
              return responseUpload    
            } catch (e) {
              console.log(e)

            }
    }

  // Summary : get access token
  // Created By :Gokul VG
    async getAccessToken():Promise<any>{
       try{
        const data = {
            grant_type:"client_credentials",
            client_id:this.configService.get('SHAREPOINT_CLIENT_ID'),
            client_secret:this.configService.get('SHAREPOINT_CLIENT_SECRET'),
            resource:this.configService.get('SHAREPOINT_RESOURCE')           
        } 
         const headersRequest = {
                "Content-Type": "application/x-www-form-urlencoded"                        
            };
        const getToken = await firstValueFrom (this.httpService.post('https://accounts.accesscontrol.windows.net/d34e6929-73f4-48ce-bac5-faf8cfea0be6/tokens/OAuth/2',
        data  ,   {headers:headersRequest}       
        )   )
        return  getToken.data.access_token;

       }catch(err){    
        console.log(err)
       }
    }

    async getFormDigestValue():Promise<AxiosResponse>{
        try{
            const access_token =await this.getAccessToken()
            const formDigestValue = await firstValueFrom(this.httpService.post("https://aottech.sharepoint.com/sites/Caseflow/_api/contextinfo",{},
            {
                headers:{
                    "Authorization":`Bearer ${access_token}`
                }
            }))
            return formDigestValue.data.FormDigestValue
            

        }catch(err){
            console.log(err)
        }
    }

}


