import { environment } from '../../../environments/environment';

const api = environment.apiUrl;

export const API_ENDPOINTS = {
  clients: `${api}/clients`,
  products: `${api}/products`,
  orders: `${api}/orders`,
  orderLines: `${api}/order-lines`,
  productionSteps: `${api}/production-steps`,
  qualityControls: `${api}/quality-controls`,
  statistics: `${api}/statistics`,
  settings: `${api}/settings`,
  delayedOrders: `${api}/orders/delayed`,
  orderProduction: (id: number) => `${api}/orders/${id}/production`,
  productionStart: (id: number) => `${api}/orders/${id}/production/start`,
  productionStepComplete: (id: number, step: 'COUPE' | 'COUTURE' | 'FINITION') =>
    `${api}/orders/${id}/production/steps/${step}/complete`,
  orderQualityControl: (id: number) => `${api}/orders/${id}/quality-control`,
  orderDelivery: (id: number) => `${api}/orders/${id}/delivery`,
};
