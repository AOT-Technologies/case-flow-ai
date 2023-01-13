export const BASE_ROUTE = "/";

interface ENV{
  REACT_APP_KEYCLOAK_WEB_CLIENTID :string,
  REACT_APP_KEYCLOAK_URL_REALM :string,
  REACT_APP_KEYCLOAK_URL :string, 
  REACT_APP_CLIENT_ROLE :string,
  REACT_APP_ADMINISTRATOR: string,
  REACT_APP_CLIENT :string
  REACT_APP_CASEFLOW_GRAPHQL_API_URL : string
  CASEFLOW_DMS : string;
  REACT_APP_CASEFLOW_API_URL : string;
  PAGINATION_TAKE:number;



}

declare global {
    interface Window {
      _env_:ENV;
    }
}



//keycloak  
export const KEYCLOAK_CLIENT =
  (window._env_ && window._env_.REACT_APP_KEYCLOAK_WEB_CLIENTID) ||
  process.env.REACT_APP_KEYCLOAK_WEB_CLIENTID ||
  "case-flow-web";

export const KEYCLOAK_REALM =
  (window._env_ && window._env_.REACT_APP_KEYCLOAK_URL_REALM) ||
  process.env.REACT_APP_KEYCLOAK_URL_REALM ||
  "caseflow";

export const KEYCLOAK_URL =
  (window._env_ && window._env_.REACT_APP_KEYCLOAK_URL) ||
  process.env.REACT_APP_KEYCLOAK_URL;

export const KEYCLOAK_AUTH_URL = `${KEYCLOAK_URL}/auth`;
export const CLIENT =
  (window._env_ && window._env_.REACT_APP_CLIENT_ROLE) ||
  process.env.REACT_APP_CLIENT_ROLE ||
  "administrator";
export const ADMINISTRATOR =
  (window._env_ && window._env_.REACT_APP_ADMINISTRATOR) ||
  process.env?.REACT_APP_ADMINISTRATOR ||
  "caseflowClient";
const CASEFLOW_ADMINISTRATOR =
  (window._env_ && window._env_.REACT_APP_ADMINISTRATOR) ||
  process.env.REACT_APP_ADMINISTRATOR;
const CASEFLOW_CLIENT =
  (window._env_ && window._env_.REACT_APP_CLIENT) ||
  process.env.REACT_APP_CLIENT;


export const ROLES = [
  {
    id: CASEFLOW_ADMINISTRATOR,
    title: ADMINISTRATOR,
  },
  {
    id: CASEFLOW_CLIENT,
    title: CLIENT,
  },
];

export  const CASEFLOW_DMS =  (window._env_ && window._env_.CASEFLOW_DMS) ||
process.env.CASEFLOW_DMS ||
"1";
export  const PAGINATION_TAKE =  (window._env_ && window._env_.PAGINATION_TAKE) ||
process.env.PAGINATION_TAKE || "" ;

export  const CASEFLOW_API_URL =  (window._env_ && window._env_.REACT_APP_CASEFLOW_API_URL) ||
process.env.REACT_APP_CASEFLOW_API_URL ||
"";
export  const CASEFLOW_GRAPHQL_API_URL =  (window._env_ && window._env_.REACT_APP_CASEFLOW_GRAPHQL_API_URL) ||
process.env.REACT_APP_CASEFLOW_GRAPHQL_API_URL ||
"";
export  const REACT_APP_CASEFLOW_LOB_GRAPHQL_API_URL =  (window._env_ && window._env_.REACT_APP_CASEFLOW_LOB_GRAPHQL_API_URL) ||
process.env.REACT_APP_CASEFLOW_LOB_GRAPHQL_API_URL ||
"";
export  const REACT_APP_PAGINATION_TAKE =  (window._env_ && window._env_.REACT_APP_PAGINATION_TAKE) ||
process.env.REACT_APP_PAGINATION_TAKE ||
"";
