import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../models/common.models';

export class ApiResourceService<TResponse, TRequest> {
  protected constructor(
    protected readonly http: HttpClient,
    protected readonly endpoint: string,
  ) {}

  list(params: Record<string, string | number> = {}): Observable<PageResponse<TResponse>> {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      httpParams = httpParams.set(key, String(value));
    }
    return this.http.get<PageResponse<TResponse>>(this.endpoint, { params: httpParams });
  }

  get(id: number): Observable<TResponse> {
    return this.http.get<TResponse>(`${this.endpoint}/${id}`);
  }

  create(request: TRequest): Observable<TResponse> {
    return this.http.post<TResponse>(this.endpoint, request);
  }

  update(id: number, request: TRequest): Observable<TResponse> {
    return this.http.put<TResponse>(`${this.endpoint}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
