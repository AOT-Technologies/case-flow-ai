import { Injectable } from '@nestjs/common';



//_____________________Custom Imports_____________________//

@Injectable()
export class TransformService {

  // summery : Transform S3 object to schema specific format
  // Created By : Don C Varghese
  transformS3 = (type, document, data,user) => {
    switch (type) {
      case 'CREATE':
        try {
          return {
            referenceId: parseInt(data?.referenceId),
            documentref: document?.key,
            name: data?.name,
            desc: data?.desc,
            addedbyuserid: user,
            creationdate: new Date(),
            dmsprovider: 1,
            latestversion: document?.VersionId,
            isdeleted: false,
            type: data?.type,
          };
        } catch (err) {
          console.log(err);
        }

      case 'UPDATE':
        try {
          return {
            documentref: document?.key,
            desc: data?.desc,
            addedbyuserid: user,
            dmsprovider: 1,
            latestversion: document?.VersionId,
            isdeleted: false,
          };
        } catch (err) {
          console.log(err);
        }
    }
  };

  // summery : Transform Alfresco object to schema specific format
  // Created By :
  transformAlfresco = (type, document, data,user) => {
    switch (type) {
      case 'CREATE':
        try {
          return {
            name: data?.name,
            documentref: document?.entry.id,
            desc: data?.desc,
            addedbyuserid: user,
            creationdate: new Date(),
            dmsprovider: 3,
            latestversion: document?.entry?.properties['cm:versionLabel'],
            isdeleted: false,
            type: data?.type,
            referenceId: data?.referenceId,
          };
        } catch (err) {
          console.log(err);
        }

      case 'UPDATE':
        try {
          return {
            documentref: document?.entry.id,
            desc: data?.desc,
            addedbyuserid: user,
            dmsprovider: 3,
            latestversion: document?.entry?.properties['cm:versionLabel'],
            isdeleted: false,
          };
        } catch (err) {
          console.log(err);
        }
    }
  };

  // summery : Transform Sharepoint object to schema specific format
  // Created By : Gokul VG
  transformSharepoint = (type, document, data,user) => {
    switch (type) {
      case 'CREATE':
        try {
          return {
            referenceId: data?.referenceId,
            documentref: document?.UniqueId,
            name: data?.name,
            desc: data?.desc,
            addedbyuserid: user,
            creationdate: new Date(),
            dmsprovider: 2,
            latestversion: document?.UIVersionLabel,
            isdeleted: false,
            type: data?.type,
          };
        } catch (err) {
          console.log(err);
        }

      case 'UPDATE':
        try {
          return {
            documentref: document?.UniqueId,
            desc: data?.desc,
            addedbyuserid: user,
            dmsprovider: 2,
            latestversion: document?.UIVersionLabel,
            isdeleted: false,
          };
        } catch (err) {
          console.log(err);
        }
    }
  };

  // summery : Transform selector fro DMS object to schema specific format
  // Created By : Don C Varghese
  transform = async (dms, type, document, data,user) => {
    try {
      switch (dms) {
        case '1':
          return await this.transformS3(type, document, data,user);

        case '2':
          return await this.transformSharepoint(type, document, data,user);

        case '3':
          return await this.transformAlfresco(type, document, data,user);
      }
    } catch (err) {
      console.log(err);
    }
  };
}
