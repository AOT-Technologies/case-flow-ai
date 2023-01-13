import { Injectable } from '@nestjs/common';
import { CreateCaseInput } from 'src/cases/dto/create-case.input';
import { UpdateCaseInput } from 'src/cases/dto/update-case.input';

//_____________________Custom Imports_____________________//

@Injectable()
export class TransformService {
  // summery : Transform the case api body and create a case database entity
  // Created By : Don Basil Peter
  transformCreateCase = (data) => {
    console.log();
    try {
      const createCaseInput: CreateCaseInput = {
        name: data.name,
        desc: data?.description,
        lobid: data?.lobid,
        statusid: data?.statusid,
        typeid: data?.typeid,
        linkedcases: data?.linkedcases,
        creationdate: data?.creationdate,
        completiondate: data?.completiondate,
        lastmodificationdate: data?.lastmodificationdate,
        penduntildate: data?.penduntildate,
        archivedate: data?.archivedate,
        startuserid: data?.startuserid,
        currentownerid: data?.currentownerid,
        involvedparties: data?.involvedparties,
        isdeleted: false,
      };
      return createCaseInput;
    } catch (err) {
      console.log(err);
    }
  };

  transformUpdateCase = (data) => {
    console.log();
    try {
      const createCaseInput: UpdateCaseInput = {
        id: data.id,
        name: data?.name,
        desc: data?.description,
        lobid: data?.lobid,
        statusid: data?.statusid,
        typeid: data?.typeid,
        linkedcases: data?.linkedcases,
        creationdate: data?.creationdate,
        completiondate: data?.completiondate,
        lastmodificationdate: data?.lastmodificationdate,
        penduntildate: data?.penduntildate,
        archivedate: data?.archivedate,
        startuserid: data?.startuserid,
        currentownerid: data?.currentownerid,
        involvedparties: data?.involvedparties,
        isdeleted: false,
      };
      return createCaseInput;
    } catch (err) {
      console.log(err);
    }
  };
}
