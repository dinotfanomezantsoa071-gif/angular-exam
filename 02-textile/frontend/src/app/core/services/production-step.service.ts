import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { ProductionStep, ProductionStepRequest } from '../models/domain.models';
import { ApiResourceService } from './api-resource.service';

@Injectable({ providedIn: 'root' })
export class ProductionStepService extends ApiResourceService<ProductionStep, ProductionStepRequest> {
  constructor(http: HttpClient) {
    super(http, API_ENDPOINTS.productionSteps);
  }
}
