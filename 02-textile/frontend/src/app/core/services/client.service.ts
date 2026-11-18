import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { Client, ClientRequest } from '../models/domain.models';
import { ApiResourceService } from './api-resource.service';

@Injectable({ providedIn: 'root' })
export class ClientService extends ApiResourceService<Client, ClientRequest> {
  constructor(http: HttpClient) {
    super(http, API_ENDPOINTS.clients);
  }
}
