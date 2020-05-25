import HttpRequests from './fetchHttp'

let domain: string = "http://127.0.0.1:9900";
let baseUri: string = "/api/1.0"

const requests = new HttpRequests();

export async function getFetch(url: string, params = {}) {
  return requests.getFetch<Response>(`${domain}${baseUri}${url}`, params);
}

export async function postFetch(url: string, params = {}) {
  return requests.postFetch<Response>(`${domain}${baseUri}${url}`, params);
}

export async function putFetch(url: string, params = {}) {
  return requests.putRequest<Response>(`${domain}${baseUri}${url}`, params);
}

export async function deleteFetch(url: string, params = {}) {
  return requests.deleteRequest<Response>(`${domain}${baseUri}${url}`, params);
}
