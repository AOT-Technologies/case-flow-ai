import {
    httpGETRequest,
    httpPUTRequest,
    httpPOSTRequest,
  } from "../apiManager/httpRequestHandler";
  import { API} from "../apiManager/endpoints";
  import { GRAPHQL } from "../apiManager/endpoints";
import {
    FETCH_CASES,
    ADD_CASE,
    DELETE_CASE,
    UPDATE_CASE,
    FETCH_DOCUMENT_OF_CASES,
    FETCH_CASE_DETAILS,    
    SEARCH_CASE_LIST,
    FETCH_RECENT_CASES,
    FETCH_CASEHISTORY,    
  } from "../graphql/caseRequests"
  import { Case } from "../dto/cases"
  import { print } from "graphql";
  // import { PAGINATION_TAK}";
  import { PAGINATION_TAKE } from "../apiManager/endpoints/config"; 

  
  export const addCases = async(newCase: Case) => {
      const url =  GRAPHQL;
      return httpPOSTRequest(url,{query: print(ADD_CASE),
        variables: {
          createCaseInput: {
            name: newCase.name,
            statusid: newCase.statusid,
            desc: newCase.desc
          },
        },
      },null)
        .then((res) => {
          return {"success" : res.data};
        })
        .catch((error) => {
          if (error?.response?.data) {
            return({"error" : error})
          } else {
            return({"error" : "something went wrong"})
          }
        });
   
  };


  export const updateCases = async(newCase: Case) => {
    const url =  GRAPHQL;
    return httpPOSTRequest(url,{query: print(UPDATE_CASE),
      variables: {
        updateCaseInput: {
          id:parseInt(newCase.id.toString()),
          name: newCase.name,
          statusid: 1,
          desc:newCase.desc
        },
      },
    },null)
      .then((res) => {
        return {"success" : res.data};
      })
      .catch((error) => {
        if (error?.response?.data) {
          return({"error" : error})
        } else {
          return({"error" : "something went wrong"})
        }
      });
 
};
  export const getCasesList = async (number) => {   
   const  skip =(number-1)*10;   
    const url = GRAPHQL;
    const  output =  await httpPOSTRequest(url,{query: print(FETCH_CASES),
      variables: {       
        Skip:skip,
        Take:Number(PAGINATION_TAKE)
        
      },
    },null)
      .then((res) => {return res.data.data.case})
      .catch((error) => {
        console.log({"error" : "error loading data"})
        return []
      });
      return output

  };
  
  export const getDocumentofCaseList = async (id,number) => {
    console.log(parseInt(id))
    const  skip =(number-1)*10; 
    const url = GRAPHQL;    
    const  output =  await httpPOSTRequest(url,{query: print(FETCH_DOCUMENT_OF_CASES),
      variables: {
        CaseId : parseInt(id),
        Skip:skip,
        Take:Number(PAGINATION_TAKE)
      },
    },null)
      .then((res) => {       
        return res.data.data.getCase.documents})
      .catch((error) => {
        console.log({"error" : error})
        return []
      });
      return output


  };

  export const getCaseDetails = async (id) => {
    console.log(parseInt(id))
    const url = GRAPHQL;
    const  output =  await httpPOSTRequest(url,{query: print(FETCH_CASE_DETAILS),
      variables: {
        CaseId : parseInt(id),
      },
    },null)
      .then((res) => {return res.data.data.getCase})
      .catch((error) => {
        console.log({"error" : error})
        return {}
      });
      return output

  };

  export const getCaseHistory = async(id) =>{
    const url = GRAPHQL
    const  output =  await httpPOSTRequest(url,{query: print(FETCH_CASEHISTORY),
      variables: {
        CaseId : parseInt(id),
      },
    },null)
      .then((res)=>{return res.data.data.getCase})
      .catch(error=>{
        console.log({"error":error})
        return {}
      });
      return output
  }

  
  export const searchCases = async (searchField,searchColumn) => {
    const url = GRAPHQL;
    const  output =  await httpGETRequest(url,{query: print(SEARCH_CASE_LIST),
      variables: {
        searchField : searchField,
        searchColumn : searchColumn
      },
    },null)
      .then((res) => {return (res.data.data.Searchcase) })
      .catch((error) => {
        console.log({"error" : "error loading data"})
        return []
      });
      return output
  };

  
  export const fetchRecentCaseList = async () => {
    const url = GRAPHQL;
    const  output =  await httpGETRequest(url,{query: print(FETCH_RECENT_CASES),
      variables: {
      },
    },null)
      .then((res) => {return (res.data.data.fetchRecentCase) })
      .catch((error) => {
        console.log({"error" : "error loading data"})
        return []
      });
      return output
  };

  