import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import {
  ActionRequest,
  ActionResponse,
  AnalyticsResponse,
  PageResponse,
  SettingRequest,
  SettingResponse,
} from '../models/common.models';
import { ProductionStep, TextileOrder } from '../models/domain.models';

@Injectable({ providedIn: 'root' })
export class OperationsService {
  constructor(private readonly http: HttpClient) {}

  statistics(params: Record<string, string | number> = {}): Observable<AnalyticsResponse> {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      httpParams = httpParams.set(key, String(value));
    }
    return this.http.get<AnalyticsResponse>(API_ENDPOINTS.statistics, { params: httpParams });
  }

  settings(): Observable<SettingResponse[]> {
    return this.http.get<SettingResponse[]>(API_ENDPOINTS.settings);
  }

  saveSetting(request: SettingRequest): Observable<void> {
    return this.http.put<void>(API_ENDPOINTS.settings, request);
  }

  production(orderId: number): Observable<PageResponse<ProductionStep>> {
    return this.http.get<PageResponse<ProductionStep>>(API_ENDPOINTS.orderProduction(orderId));
  }

  runProductionAction(url: string, request?: ActionRequest): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(url, request ?? {});
  }

  productionActionUrl(orderId: number, step?: 'COUPE' | 'COUTURE' | 'FINITION'): string {
    return step
      ? API_ENDPOINTS.productionStepComplete(orderId, step)
      : API_ENDPOINTS.productionStart(orderId);
  }

  delivery(orderId: number, request?: ActionRequest): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(API_ENDPOINTS.orderDelivery(orderId), request ?? {});
  }

  delayedOrders(): Observable<PageResponse<TextileOrder>> {
    return this.http.get<PageResponse<TextileOrder>>(API_ENDPOINTS.delayedOrders);
  }
}
