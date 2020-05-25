import {message} from "antd";

export enum ContentType {
  JSON = 'application/json;charset=UTF-8',
  FORM = 'application/x-www-form-urlencoded; charset=UTF-8'
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

class UserNotAuthenticatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotAuthenticatedError"
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError"
  }
}

export interface IHttp {
  getFetch<R, P = {}>(url: string, params?: P, options?: RequestInit): Promise<R>;

  postFetch<R, P = {}>(url: string, params?: P): Promise<R>;
}

export default class HttpRequests implements IHttp {
  public handleUrl = (url: string) => (params: any): string => {
    if (params) {
      let paramsArray: string[] = [];
      Object.keys(params).forEach(key => paramsArray.push(key + "=" + encodeURIComponent(params[key])));
      if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&')
      } else {
        url += '&' + paramsArray.join('&')
      }
    }
    return url;
  };

  public handleHeaders = (contentType: ContentType = ContentType.JSON): Headers => {
    const headers: Headers = new Headers();
    let loginToken = localStorage.getItem("loginToken");
    if (loginToken) {
      let token = JSON.parse(loginToken);
      headers.append("Authorization", token.access_token);
    }
    headers.append("CLOUD_HEADER", "CLOUD_HEADER_VALUE");
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Access-Control-Allow-Headers", "*");
    headers.append("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    headers.append("Access-Control-Allow-Credentials", "false");
    headers.append("BasicAuthorization", "Basic d2ViQXBwOndlYkFwcA==");

    headers.set("Content-Type", contentType);
    return headers;
  };

  public handleResponse = (response: Response): any => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 401) {
      throw new UserNotAuthenticatedError("用户未认证!")
    } else if (response.status === 404) {
      throw new NotFoundError("请求地址错误!")
    } else {
      throw new Error("服务器繁忙，请稍后再试！")
    }
  };

  public handleResponseData = (response: any): any => {
    if (response.code === 200) {
      return response;
    } else {
      throw new Error(response.message)
    }
  };

  public handleResponseError = (error: Error): any => {
    if (error instanceof TypeError) {
      message.error("当前网络不可用，请检查网络设置！");
    } else {
      message.error(error.message)
    }
  };

  public async getFetch<R, P = {}>(url: string, params?: P, options?: RequestInit): Promise<R> {
    options = {
      method: HttpMethod.GET,
      mode: "cors",
      headers: this.handleHeaders()
    };

    return await fetch(this.handleUrl(url)(params), options)
        .then<R>((response: Response) => {
          return this.handleResponse(response);
        })
        .then<any>((data: any) => {
          return this.handleResponseData(data);
        })
        .catch<any>((error: Error) => {
          this.handleResponseError(error);
        });
  }

  public async postFetch<R, P = {}>(url: string, params?: P): Promise<R> {
    const options: RequestInit = {
      method: HttpMethod.POST,
      mode: "cors",
      headers: this.handleHeaders(),
      body: JSON.stringify(params)
    };

    return await fetch(url, options)
        .then<R>((response: Response) => {
          return this.handleResponse(response);
        })
        .then<any>((data: any) => {
          return this.handleResponseData(data);
        })
        .catch<any>((error: Error) => {
          this.handleResponseError(error);
        });
  }

  public async putRequest<R, P = {}>(url: string, params?: P): Promise<R> {
    return await fetch(url, {
      method: HttpMethod.PUT,
      mode: "cors",
      body: JSON.stringify(params),
      headers: this.handleHeaders()
    }).then<R>((response: Response) => {
      return this.handleResponse(response);
    }).then<any>((data: any) => {
      return this.handleResponseData(data);
    }).catch<any>((error: Error) => {
      this.handleResponseError(error);
    });
  };

  public async deleteRequest<R, P = {}>(url: string, params?: P): Promise<R> {
    return await fetch(url, {
      method: HttpMethod.DELETE,
      mode: "cors",
      body: JSON.stringify(params),
      headers: this.handleHeaders()
    }).then<R>((response: Response) => {
      return this.handleResponse(response);
    }).then<any>((data: any) => {
      return this.handleResponseData(data);
    }).catch<any>((error: Error) => {
      this.handleResponseError(error);
    });
  };
}
