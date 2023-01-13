import gql from 'graphql-tag'



export const FETCH_CASES = gql`
query case($Skip:Int,$Take:Int) { 
    case(take:$Take skip:$Skip){  
      totalCount
      Cases{
         id,
         name,
         desc,

      }    
  }
}`

export const FETCH_DOCUMENT_OF_CASES = gql`
query getCase($CaseId:Int!,$Skip:Int,$Take:Int){
  getCase(id:$CaseId){    
    documents(skip:$Skip,take:$Take){
      totalCount,
      CaseDocuments{
      id,
      name,
      caseId,
      latestversion,
      creationdate,
      type,

      }
    }
  }
  }`

  export const FETCH_CASE_DETAILS= gql`
query getCase($CaseId:Int!){
  getCase(id:$CaseId){
    id,
    name,
    desc,
  }
  }`




export const ADD_CASE = gql`
  mutation createCase($createCaseInput:CreateCaseInput!){
    createCase(createCaseInput:$createCaseInput){
      id
    }
  }`


export const DELETE_CASE = gql`
  mutation removeCase($caseId:Int!){
    removeCase(id:$caseId){
      id
    }
  }`

export const UPDATE_CASE = gql`
  mutation updateCase($updateCaseInput:UpdateCaseInput!){
    updateCase(updateCaseInput:$updateCaseInput){
     id
    }
  }`

export const FETCH_CASEHISTORY = gql`
  query casehistory($caseId:Int!){
    case(id:$caseId){
      datetime,
      outcome,
      eventId{
        eventtype{
          text
        }
      },
    }
  }`



export const SEARCH_CASE_LIST = gql`
query Searchcase($searchField:String!,$searchColumn:String!,$Skip:Int,$Take:Int){
  Searchcase(searchField:$searchField,searchColumn:$searchColumn,skip:$Skip,take:$Take){
    totalCount,
    Cases{
      id,
      name,
      desc
    }

    }
  }`

  export const FETCH_RECENT_CASES = gql`
query{
  fetchRecentCase{
    id,
    name,
    desc,
  }
}`