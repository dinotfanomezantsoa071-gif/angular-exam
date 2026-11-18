export interface Client {
  id: number;
  version: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ClientRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: number;
  version: number;
  name: string;
  reference: string;
  description: string;
  unitPrice: number;
}

export interface ProductRequest {
  name: string;
  reference: string;
  description: string;
  unitPrice: number;
}

export interface TextileOrder {
  id: number;
  version: number;
  number: string;
  clientId: number;
  orderDate: string;
  deliveryDate: string;
  priority: string;
  status: string;
  deliveredAt: string | null;
}

export interface TextileOrderRequest {
  number: string;
  clientId: number;
  orderDate: string;
  deliveryDate: string;
  priority: 'NORMALE' | 'URGENTE' | 'TRES_URGENTE';
}

export interface OrderLine {
  id: number;
  version: number;
  orderId: number;
  productId: number;
  quantity: number;
  size: string;
  color: string;
  unitPrice: number;
  producedQuantity: number;
}

export interface OrderLineRequest {
  orderId: number;
  productId: number;
  quantity: number;
  size: string;
  color: string;
  unitPrice: number;
}

export interface ProductionStep {
  id: number;
  version: number;
  orderId: number;
  type: 'COUPE' | 'COUTURE' | 'FINITION';
  responsible: string;
  plannedStart: string;
  plannedEnd: string;
  comment: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  quantity: number | null;
}

export interface ProductionStepRequest {
  orderId: number;
  type: 'COUPE' | 'COUTURE' | 'FINITION';
  responsible: string;
  plannedStart: string;
  plannedEnd: string;
  comment: string;
}

export interface QualityControl {
  id: number;
  version: number;
  orderId: number;
  result: string;
  responsible: string;
  comment: string;
  checkedAt: string;
}

export interface QualityControlRequest {
  orderId: number;
  result: 'CONFORME' | 'NON_CONFORME';
  responsible: string;
  comment: string;
}
