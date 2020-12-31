import queryString from "query-string";

export const objectToQueryString = (obj, options = {}) => {
  console.log({ paramsSerializer: obj });
  return queryString.stringify(obj, {
    arrayFormat: "bracket",
    ...options,
  });
};
