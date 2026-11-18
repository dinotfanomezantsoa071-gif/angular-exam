import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { QualityControl, QualityControlRequest } from '../models/domain.models';
import { ApiResourceService } from './api-resource.service';

@Injectable({ providedIn: 'root' })
export class QualityControlService extends ApiResourceService<QualityControl, QualityControlRequest> {
  constructor(http: HttpClient) {
    super(http, API_ENDPOINTS.qualityControls);
  }
}
