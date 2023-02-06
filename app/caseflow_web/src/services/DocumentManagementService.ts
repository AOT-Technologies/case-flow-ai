import {
  httpGETBolbRequest,
  httpGETRequest,
  httpDELETERequest,
  httpPOSTRequest,
  httpPUTRequest

} from "../apiManager/httpRequestHandler";
import {API, GRAPHQL} from "../apiManager/endpoints";
import { FETCH_DOCUMENTS,SEARCH_DOCUMENT_LIST } from "../graphql/documentsRequests";
import { print } from "graphql";
// export const getDocumetById = (documentId) => {
//   return (dispatch) => {
//     const url = API.DMS_API + "download?id=" + documentId;
//     httpGETRequest(url)
//       .then((res) => {})
//       .catch((error) => {
//         if (error?.response?.data) {
//           dispatch(dashboardErrorHandler(error.response.data));
//         } else {
//           dispatch(dashboardErrorHandler("Failed to fetch dashboards"));
//         }
//       });
//   };
// };




export const  getAllDocuments = async () => {
  const url = GRAPHQL;
  const  output =  await httpGETRequest(url,{query: print(FETCH_DOCUMENTS),
    variables: {
    },
  },null)
    .then((res) => {return res.data.data.documents    })
    .catch((error) => {
      console.log({"error" : "error loading data"})
      return []
    });
    return output
}

export const  getDocument = async (id) => {
  const url = API.DMS_API + "?id=" + id;
  const data = await httpGETBolbRequest(url,null,null)
  .then((res) => {return res})
  .catch((error) => {
    if (error?.response?.data) {
      return({"error" : error})
    } else {
      return({"error" : "something went wrong"})

    }
  })
  
  return data;
}

// function for soft  delete documents
export const  deleteDocument = async (id) => {
  const uploadURL = API.DMS_API+"delete";
  let bodyFormData = new FormData(); 
  bodyFormData.append('id', id);
  console.log(bodyFormData)
  try{
    let response = await httpPUTRequest(uploadURL,bodyFormData,null);
    return response;
  }
  catch(err){
    return err;
  }


  // const url = API.DMS_API + "?id=" + id;
  // const data = await httpDELETERequest(url,null)
  // .then((res) => {return res})
  // .catch((error) => {
  //   if (error?.response?.data) {
  //     return({"error" : error})
  //   } else {
  //     return({"error" : "something went wrong"})

  //   }
  // })
  
  // return data;
}







export const searchCaseDocument= async (searchField,searchColumn) => {
  const url = GRAPHQL;
  const  output =  await httpGETRequest(url,{query: print(SEARCH_DOCUMENT_LIST),
    variables: {
      searchField : searchField,
      searchColumn : searchColumn
    },
  },null)
    .then((res) => {return (res.data.data.SearchcaseDocument) })
    .catch((error) => {
      console.log({"error" : "error loading data"})
      return []
    });
    return output
};

