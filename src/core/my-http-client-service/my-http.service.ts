import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class MyHttpService {
  constructor(private httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use((config: any) => {
      console.log(`Request to ${config.url}`, {
        method: config.method,
        header: config.headers.toJSON(),
        body: config.data,
      });
      return config;
    });
    this.httpService.axiosRef.interceptors.response.use((config: any) => {
      console.log(`response from ${config.request.path}`, {
        status: config.status,
        header: config.headers.toJSON(),
        body: config.data,
      });
      return config;
    });
  }
  buildQueryString(obj: any, prefix = ''){
    const queryParts: string[] = [];
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Process nested objects recursively
        queryParts.push(this.buildQueryString(obj[key], `${prefix}${key}[`));
      } else {
        // Add the current key-value pair
        queryParts.push(`${encodeURIComponent(prefix + key)}=${encodeURIComponent(obj[key])}`);
      }
    }
    return queryParts.join('&').replace(/\[\]$/, ']'); // Ensure the trailing bracket for nested keys is correct
  };

  private _prepareHeaders(mainHeader: any, config?: AxiosRequestConfig) {
    return {
      ...config,
      headers: {
        'lang':mainHeader['lang'] || 'en',
        'content-type': mainHeader['content-type'] || 'application/json',
        'x-platform': 'fuse',
        'x-correlation-id': mainHeader['x-correlation-id'],
        authorization: mainHeader['authorization'],
        'x-client-service': mainHeader['x-client-service'],
        'x-clients-ancestors': mainHeader['x-clients-ancestors'],
      },
    };
  }

  get axiosRef(): AxiosInstance {
    return this.httpService.axiosRef;
  }

  get<T = any>(url: string, mainHeader?: any, config?: any): Observable<AxiosResponse<T>> {
    const _config = this._prepareHeaders(mainHeader, config);
    return this.httpService.get<T>(url, _config);
  }

  post<T = any>(url: string, data?: any, mainHeader?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    const _config = this._prepareHeaders(mainHeader, config);
    return this.httpService.post<T>(url, data, _config);
  }

  put<T = any>(url: string, data?: any, mainHeader?: any, config?: any): Observable<AxiosResponse<T>> {
    const _config = this._prepareHeaders(mainHeader, config);
    return this.httpService.put<T>(url, data, _config);
  }

  delete<T = any>(url: string, mainHeader?: any, config?: any): Observable<AxiosResponse<T>> {
    const _config = this._prepareHeaders(mainHeader, config);
    return this.httpService.delete<T>(url, _config);
  }

  patch<T = any>(url: string, data?: any, mainHeader?: any, config?: AxiosRequestConfig): Observable<AxiosResponse<T>> {
    const _config = this._prepareHeaders(mainHeader, config);
    return this.httpService.patch<T>(url, _config);
  }
  handelFilter(query: any): string {
    const queryParams: string[] = [];
  
    const encodeKey = (key: string): string =>
      key.replace(/%5B/g, '[').replace(/%5D/g, ']');
  
    const buildFilterQuery = (key: string, value: any): string[] => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return Object.entries(value).flatMap(([subKey, subValue]) =>
          buildFilterQuery(`[${key}][${subKey}]`, subValue)
        );
      }
      if(key.startsWith('[')){

        return [`${encodeKey(`filter${key}`)}=${encodeURIComponent(String(value))}`];
      }
      return [`${encodeKey(`filter[${key}]`)}=${encodeURIComponent(String(value))}`];

    };
  
    if (query.filter) {
      for (const [key, value] of Object.entries(query.filter)) {
        queryParams.push(...buildFilterQuery(key, value));
      }
    }
  
    if (query.pageIndex) {
      queryParams.push(`pageIndex=${encodeURIComponent(query.pageIndex)}`);
    }
    if (query.pageSize) {
      queryParams.push(`pageSize=${encodeURIComponent(query.pageSize)}`);
    }
  
    return queryParams.join('&');
  }
}
