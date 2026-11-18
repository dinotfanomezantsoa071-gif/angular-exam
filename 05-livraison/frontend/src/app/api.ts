import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ApiPage<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiRecord {
  id?: number;
  version?: number;
  [key: string]: string | number | null | undefined;
}

export type ModuleKey = 'clients' | 'deliverers' | 'orders' | 'parcels' | 'incidents' | 'proofs';
export type FieldKind = 'text' | 'email' | 'tel' | 'number' | 'datetime-local' | 'select' | 'textarea';
export interface FormField {
  key: string;
  label: string;
  type?: FieldKind;
  required?: boolean;
  min?: number;
  step?: number;
  options?: string[];
  hint?: string;
  relation?: 'clients' | 'orders';
}
export interface ModuleDefinition {
  title: string;
  singular: string;
  endpoint: string;
  fields: FormField[];
  columns: { key: string; label: string; format?: 'status' | 'date' | 'currency' }[];
  canEdit?: boolean;
  canDelete?: boolean;
}

export const MODULES: Record<ModuleKey, ModuleDefinition> = {
  clients: {
    title: 'Clients', singular: 'client', endpoint: '/api/clients',
    fields: [
      { key: 'name', label: 'Nom complet', required: true },
      { key: 'email', label: 'Adresse e-mail', type: 'email', required: true },
      { key: 'phone', label: 'Téléphone', type: 'tel', required: true },
      { key: 'address', label: 'Adresse', type: 'textarea', required: true }
    ],
    columns: [{ key: 'name', label: 'Client' }, { key: 'email', label: 'E-mail' },
      { key: 'phone', label: 'Téléphone' }, { key: 'address', label: 'Adresse' }]
  },
  deliverers: {
    title: 'Livreurs', singular: 'livreur', endpoint: '/api/deliverers',
    fields: [
      { key: 'name', label: 'Nom complet', required: true },
      { key: 'phone', label: 'Téléphone', type: 'tel', required: true },
      { key: 'vehicle', label: 'Véhicule', required: true },
      { key: 'zone', label: 'Zone', required: true },
      { key: 'maxWeight', label: 'Capacité poids (kg)', type: 'number', min: 0.01, step: 0.1, required: true },
      { key: 'maxVolume', label: 'Capacité volume (m³)', type: 'number', min: 0.01, step: 0.01, required: true },
      { key: 'distanceToPickup', label: 'Distance au dépôt (km)', type: 'number', min: 0, step: 0.1, required: true },
      { key: 'maxDeliveries', label: 'Livraisons simultanées max.', type: 'number', min: 1, step: 1, required: true },
      { key: 'status', label: 'Disponibilité', type: 'select', required: true,
        options: ['DISPONIBLE', 'EN_LIVRAISON', 'INDISPONIBLE', 'PAUSE'] }
    ],
    columns: [{ key: 'name', label: 'Livreur' }, { key: 'phone', label: 'Téléphone' },
      { key: 'vehicle', label: 'Véhicule' }, { key: 'zone', label: 'Zone' },
      { key: 'status', label: 'Disponibilité', format: 'status' }]
  },
  orders: {
    title: 'Commandes', singular: 'commande', endpoint: '/api/orders',
    fields: [
      { key: 'number', label: 'Numéro de commande', required: true },
      { key: 'clientId', label: 'Client', type: 'select', required: true, relation: 'clients' },
      { key: 'pickupAddress', label: 'Adresse de collecte', type: 'textarea', required: true },
      { key: 'deliveryAddress', label: 'Adresse de livraison', type: 'textarea', required: true },
      { key: 'weight', label: 'Poids total (kg)', type: 'number', min: 0.01, step: 0.1, required: true },
      { key: 'volume', label: 'Volume total (m³)', type: 'number', min: 0.01, step: 0.01, required: true },
      { key: 'priority', label: 'Priorité', type: 'select', required: true,
        options: ['NORMALE', 'URGENTE', 'TRES_URGENTE'] },
      { key: 'distance', label: 'Distance (km)', type: 'number', min: 0.01, step: 0.1, required: true },
      { key: 'zone', label: 'Zone de livraison', required: true },
      { key: 'expectedAt', label: 'Livraison prévue le', type: 'datetime-local', required: true }
    ],
    columns: [{ key: 'number', label: 'Commande' }, { key: 'clientId', label: 'Client #' },
      { key: 'zone', label: 'Zone' }, { key: 'priority', label: 'Priorité', format: 'status' },
      { key: 'status', label: 'État', format: 'status' }, { key: 'price', label: 'Prix', format: 'currency' },
      { key: 'expectedAt', label: 'Échéance', format: 'date' }]
  },
  parcels: {
    title: 'Colis', singular: 'colis', endpoint: '/api/parcels',
    fields: [
      { key: 'orderId', label: 'Commande', type: 'select', min: 1, step: 1, required: true, relation: 'orders' },
      { key: 'reference', label: 'Référence', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'weight', label: 'Poids (kg)', type: 'number', min: 0.01, step: 0.1, required: true },
      { key: 'volume', label: 'Volume (m³)', type: 'number', min: 0.01, step: 0.01, required: true }
    ],
    columns: [{ key: 'reference', label: 'Référence' }, { key: 'orderId', label: 'Commande #' },
      { key: 'description', label: 'Description' }, { key: 'weight', label: 'Poids (kg)' },
      { key: 'volume', label: 'Volume (m³)' }]
  },
  incidents: {
    title: 'Incidents', singular: 'incident', endpoint: '/api/incidents', canEdit: false, canDelete: false,
    fields: [
      { key: 'orderId', label: 'Commande', type: 'select', min: 1, step: 1, required: true, relation: 'orders' },
      { key: 'type', label: 'Type d’incident', type: 'select', required: true,
        options: ['CLIENT_ABSENT', 'ADRESSE_INCORRECTE', 'COLIS_ENDOMMAGE', 'PANNE', 'REFUS_CLIENT'] },
      { key: 'description', label: 'Description', type: 'textarea', required: true }
    ],
    columns: [{ key: 'orderId', label: 'Commande #' }, { key: 'type', label: 'Type', format: 'status' },
      { key: 'description', label: 'Description' }, { key: 'resolution', label: 'Résolution' },
      { key: 'occurredAt', label: 'Signalé le', format: 'date' }]
  },
  proofs: {
    title: 'Preuves de livraison', singular: 'preuve', endpoint: '/api/proofs',
    canEdit: false, canDelete: false,
    fields: [
      { key: 'orderId', label: 'Commande', type: 'select', min: 1, step: 1, required: true, relation: 'orders' },
      { key: 'recipient', label: 'Réceptionnaire', required: true },
      { key: 'confirmationCode', label: 'Code de confirmation', required: true },
      { key: 'comment', label: 'Commentaire', type: 'textarea' },
      { key: 'deliveredAt', label: 'Remis le', type: 'datetime-local', required: true }
    ],
    columns: [{ key: 'orderId', label: 'Commande #' }, { key: 'recipient', label: 'Réceptionnaire' },
      { key: 'confirmationCode', label: 'Code' }, { key: 'comment', label: 'Commentaire' },
      { key: 'deliveredAt', label: 'Remis le', format: 'date' }]
  }
};

@Injectable({ providedIn: 'root' })
export class LivraisonApi {
  private readonly http = inject(HttpClient);

  list<T extends ApiRecord>(endpoint: string, q = '', status = '', page = 0, size = 20) {
    let params = new HttpParams().set('page', page).set('size', size).set('sort', 'id,desc');
    if (q.trim()) params = params.set('q', q.trim());
    if (status.trim()) params = params.set('status', status.trim());
    return this.http.get<ApiPage<T>>(endpoint, { params });
  }

  get<T extends ApiRecord>(endpoint: string, id: number) {
    return this.http.get<T>(`${endpoint}/${id}`);
  }

  create<T>(endpoint: string, value: unknown) {
    return this.http.post<T>(endpoint, value);
  }

  update<T>(endpoint: string, id: number, value: unknown) {
    return this.http.put<T>(`${endpoint}/${id}`, value);
  }

  remove(endpoint: string, id: number) {
    return this.http.delete<void>(`${endpoint}/${id}`);
  }

  action<T = unknown>(path: string, body: unknown = {}) {
    return this.http.post<T>(`/api/${path}`, body);
  }

  tracking(id: number) {
    return this.http.get<unknown[]>(`/api/orders/${id}/tracking`);
  }

  statistics(from?: string, to?: string, zone = '') {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    if (zone.trim()) params = params.set('zone', zone.trim());
    return this.http.get<AnalyticsResponse>('/api/statistics', { params });
  }

  settings(): Observable<Setting[]> {
    return this.http.get<Setting[]>('/api/settings');
  }

  saveSetting(name: string, value: number) {
    return this.http.put<void>('/api/settings', { name, value });
  }
}

export interface AnalyticsResponse {
  metrics: Record<string, number>;
  groups: Record<string, Record<string, number>>;
}

export interface Setting {
  name: string;
  label: string;
  value: number;
}

export function moduleDefinition(key: string): ModuleDefinition | null {
  return Object.prototype.hasOwnProperty.call(MODULES, key) ? MODULES[key as ModuleKey] : null;
}
