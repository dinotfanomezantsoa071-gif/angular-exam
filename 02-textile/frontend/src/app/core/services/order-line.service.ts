import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { OrderLine, OrderLineRequest } from '../models/domain.models';
import { ApiResourceService } from './api-resource.service';

@Injectable({ providedIn: 'root' })
export class OrderLineService extends ApiResourceService<OrderLine, OrderLineRequest> {
  constructor(http: HttpClient) {
    super(http, API_ENDPOINTS.orderLines);
  }
}
