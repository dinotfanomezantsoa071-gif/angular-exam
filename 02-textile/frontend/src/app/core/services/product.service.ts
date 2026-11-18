import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { Product, ProductRequest } from '../models/domain.models';
import { ApiResourceService } from './api-resource.service';

@Injectable({ providedIn: 'root' })
export class ProductService extends ApiResourceService<Product, ProductRequest> {
  constructor(http: HttpClient) {
    super(http, API_ENDPOINTS.products);
  }
}
