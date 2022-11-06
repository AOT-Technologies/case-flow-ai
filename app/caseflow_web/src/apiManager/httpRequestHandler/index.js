import axios from "axios";

import UserService from "../../services/UserService";

// const qs = require("querystring");

export const httpGETRequest = (
  url,
  data,
  config,
  token,
  isBearer = true,
  headers = null
) => {
  return axios.get(url, {
    params: data,
    headers: !headers
      ? {
          Authorization: isBearer
            ? `Bearer ${token || UserService.getToken()}`
            : token,
        }
      : headers,
    config: config,
  });
};

export const httpPOSTRequest = (url, data, token, isBearer = true) => {
  return axios.post(url, data, {
    headers: {
      Authorization: isBearer
        ? `Bearer ${token || UserService.getToken()}`
        : token,
    },
  });
};

export const httpPOSTRequestWithoutToken = (
  url,
  data,
  token,
  // eslint-disable-next-line no-unused-vars
  isBearer = true
) => {
  return axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const httpPOSTRequestWithHAL = (url, data, token, isBearer = true) => {
  return axios.post(url, data, {
    headers: {
      Authorization: isBearer
        ? `Bearer ${token || UserService.getToken()}`
        : token,
      Accept: "application/hal+json",
    },
  });
};

export const httpPUTRequest = (url, data, token, isBearer = true) => {
  return axios.put(url, data, {
    headers: {
      Authorization: isBearer
        ? `Bearer ${token || UserService.getToken()}`
        : token,
    },
  });
};

export const httpDELETERequest = (url, token, isBearer = true) => {
  return axios.delete(url, {
    headers: {
      Authorization: isBearer
        ? `Bearer ${token || UserService.getToken()}`
        : token,
    },
  });
};

export const httpGETBolbRequest = (
  url,
  data,
  token,
  isBearer = true,
  headers = null
) => {
  return axios.get(url, {
    params: data,
    headers: !headers
      ? {
          Authorization: isBearer
            ? `Bearer ${token || UserService.getToken()}`
            : token,
        }
      : headers,
    responseType: "blob",
  });
};
