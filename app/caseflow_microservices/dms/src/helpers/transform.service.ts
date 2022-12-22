import { Injectable } from '@nestjs/common';

//_____________________Custom Imports_____________________//

@Injectable()
export class TransformService {

  // summery : Transform S3 object to schema specific format
  // Created By : Don C Varghese
  transformS3 = (type, document, data) => {
    console.log(type)
    switch (type) {
      case 'CREATE':
        try{
          return {
            caseid: parseInt(data.caseid),
            documentref: document.key,
            name: data.name,
            desc: data.desc,
            addedbyuserid: data.addedbyuserid,
            creationdate: new Date(),
            dmsprovider: 1,
            latestversion: document.VersionId,
            isdeleted: false,
          };
        }
        catch(err){
          console.log(err)
        }
        

      case 'UPDATE':
        return {
          documentref: document.key,
          desc: data.desc,
          addedbyuserid: data.addedbyuserid,
          creationdate: new Date(),
          dmsprovider: 1,
          latestversion: document.VersionId,
          isdeleted: false,
        };
    }
  };

  // summery : Transform Alfresco object to schema specific format
  // Created By : 
  transformAlfresco = (type, document, data) => {
    switch (type) {
      case 'CREATE':
        return {

          documentref: document.entry.id,
          desc: data.desc,
          addedbyuserid: data.addedbyuserid,
          creationdate: new Date(),
          dmsprovider: 1,
          latestversion: document.entry.properties['cm:versionLabel'],
          isdeleted: false,

        };

      case 'UPDATE':
        return {};
    }
  };

  // summery : Transform Sharepoint object to schema specific format
  // Created By : Gokul VG
  transformSharepoint = (type, document, data) => {
    switch (type) {
      case 'CREATE':       
          return {
              caseid: data.caseid,
              documentref: document.UniqueId,
              name: data.name,
              desc: data.desc,
              addedbyuserid: data.addedbyuserid,
              creationdate: new Date(),
              dmsprovider: data.dmsprovider,
              latestversion: document.UIVersionLabel,
              isdeleted: false,
          };
      
      case 'UPDATE':
        return {
          documentref: document.UniqueId,
          desc: data.desc,
          addedbyuserid: data.addedbyuserid,
          creationdate: new Date(),
          dmsprovider: data.dmsprovider,
          latestversion: document.UIVersionLabel,
          isdeleted: false,
        };
    }
  };


  // summery : Transform selector fro DMS object to schema specific format
  // Created By : Don C Varghese
  transform = (dms, type, document, data) => {
    console.log("dms",dms,type)
    switch (dms) {
      case '1':
        return this.transformS3(type, document, data);

      case '2':
          return this.transformSharepoint(type, document, data);

      case '3':
        return this.transformAlfresco(type, document, data);

     
    }
  };
}