import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { App } from "vue";
import VueAxios from "vue-axios";

import JwtService from "@/core/services/JwtService";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    // eslint-disable-next-line
    // @ts-ignore
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_BASE_URL;

    ApiService.vueInstance.axios.defaults.paramsSerializer = function (params) {
      const serializedParams = [];
      for (const key in params) {
        const value = params[key];
        if (value !== undefined) {
          if (Array.isArray(value)) {
            for (const val of value) {
              serializedParams.push(`${key}=${val}`);
            }
          } else {
            serializedParams.push(`${key}=${value}`);
          }
        }
      }
      return serializedParams.join("&");
    };
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
    ApiService.vueInstance.axios.defaults.headers.common["Accept-Language"] =
      localStorage.getItem("locale") || "ru";
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(
    resource: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static get(
    resource: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, config);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param data: request body
   * @param params?: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post(
    resource: string,
    data: any,
    params?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(`${resource}`, data, params);
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(
    resource: string,
    data?: any,
    params?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, data, params);
  }

  public static patch(
    resource: string,
    data?: any,
    params?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.patch(`${resource}`, data, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.delete(resource);
  }
}

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async function (error) {
    const originalRequest = error.config;
    const refresh = localStorage.getItem("refresh");
    const access = localStorage.getItem("id_token");
    if (refresh && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      axios
        .post(
          "api/v2/auth/token/refresh/",
          {
            refresh: refresh,
          },
          {
            headers: {
              Authorization: undefined,
            },
          }
        )
        .then((res) => {
          JwtService.saveToken(res.data.access);
          // originalRequest.headers["Authorization"] =
          //   "Bearer " + res.data.access;
          // return axios.request(originalRequest);
          const config = error.config;
          config.headers = { Authorization: `Bearer ${res.data.access}` };

          return new Promise((resolve, reject) => {
            axios
              .request(config)
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                reject(error);
              });
          });
        })
        .catch((err) => {
          originalRequest.headers.Authorization = undefined;
          localStorage.removeItem("refresh");
          localStorage.removeItem("id_token");

          return Promise.reject(err);
        });
    }
    return await Promise.reject(error);
  }
);

export default ApiService;
