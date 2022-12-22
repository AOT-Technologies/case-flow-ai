export const BASE_ROUTE = "/";

interface ENV{
  REACT_APP_KEYCLOAK_WEB_CLIENTID :string,
  REACT_APP_KEYCLOAK_URL_REALM :string,
  REACT_APP_KEYCLOAK_URL :string, 
  REACT_APP_CLIENT_ROLE :string,
  REACT_APP_ADMINISTRATOR: string,
  REACT_APP_CLIENT :string
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