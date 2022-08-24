import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiSourceType } from './enums';

@Injectable({ providedIn: 'root' })
export class HttpService {

  private baseUrls: Map<ApiSourceType, string> = new Map();  
  private apiBaseUrl = new BehaviorSubject<ApiSourceType>(ApiSourceType.default);

  constructor(private http: HttpClient) {
    this.baseUrls.set(ApiSourceType.default, environment.apiBaseUrl);
    this.baseUrls.set(ApiSourceType.fallback, environment.fallbackApiBaseUrl);
  }

  public setApiSource(sourceType: ApiSourceType): void {
    this.apiBaseUrl.next(sourceType);
  }

  private getApiBaseUrl(): string {
    return this.baseUrls.get(this.apiBaseUrl.value) || '';
  }

  public apiSourceUpdates(): Observable<string> {
    return this.apiBaseUrl.asObservable();
  }

  public get(path: string, options: any = {}): Observable<unknown> {
    return this.http.get(`${this.getApiBaseUrl()}/${path}`, options);
  }

  public post(path: string, body: unknown, options: any = {}): Observable<unknown> {
    return this.http.post(`${this.getApiBaseUrl()}/${path}`, body, options);
  }

  public put(path: string, body: unknown, options: any = {}): Observable<unknown> {
    return this.http.put(`${this.getApiBaseUrl()}/${path}`, body, options);
  }

  public patch(path: string, body: unknown, options: any = {}): Observable<unknown> {
    return this.http.patch(`${this.getApiBaseUrl()}/${path}`, body, options);
  }

  public delete(path: string, options: any = {}): Observable<unknown> {
    return this.http.delete(`${this.getApiBaseUrl()}/${path}`, options)
  }
}
