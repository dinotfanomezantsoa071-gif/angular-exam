import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { TextileOrder, TextileOrderRequest } from '../models/domain.models';
import { ApiResourceService } from './api-resource.service';
import { PageResponse } from '../models/common.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TextileOrderService extends ApiResourceService<TextileOrder, TextileOrderRequest> {
  constructor(http: HttpClient) {
    super(http, API_ENDPOINTS.orders);
  }

  delayed(): Observable<PageResponse<TextileOrder>> {
    return this.http.get<PageResponse<TextileOrder>>(API_ENDPOINTS.delayedOrders);
  }
}
