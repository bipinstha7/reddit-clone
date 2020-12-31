// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";
import { useRouter } from "next/router";

import { objectToQueryString } from "utils/url";
import { getStoredAuthToken, removeStoredAuthToken } from "utils/authToken";

const defaults = {
  baseURL: process.env.API_URL || "http://localhost:4000/api/v1",
  headers: () => ({
    "Content-Type": "application/json",
    Authorization: getStoredAuthToken() ? `${getStoredAuthToken()}` : undefined,
  }),
  error: {
    code: "INTERNAL_ERROR",
    message:
      "Something went wrong. Please check your internet connection or contact our support.",
    status: 503,
    data: {},
  },
};

const api = (method, router, url, variables) =>
  new Promise((resolve, reject) => {
    axios({
      url: `${defaults.baseURL}${url}`,
      method,
      headers: defaults.headers(),
      params: method === "get" ? variables : undefined,
      data: method !== "get" ? variables : undefined,
      paramsSerializer: objectToQueryString,
    }).then(
      response => {
        resolve(response.data);
      },
      error => {
        console.log({ error });
        if (error.response) {
          if (error.response.data.error === "INVALID_TOKEN") {
            removeStoredAuthToken();

            router.push("/authenticate");
          } else {
            reject(error.response.data.errors || error.response.data.error);
          }
        } else {
          reject(defaults.error);
        }
      }
    );
  });

export default function useApi() {
  const router = useRouter();
  const get = (...args) => api("get", router, ...args);
  const post = (...args) => api("post", router, ...args);
  const put = (...args) => api("put", router, ...args);
  const deleteFn = (...args) => api("delete", router, ...args);

  const API = { get, post, put, delete: deleteFn };
  return { API };
}
