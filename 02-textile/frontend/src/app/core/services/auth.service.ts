import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { AnalyticsResponse } from '../models/common.models';

interface Credentials {
  username: string;
  password: string;
}

const USER_ROLES: Record<string, string> = {
  admin: 'ADMIN',
  manager: 'MANAGER',
  operator: 'OPERATOR',
  user: 'USER',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Credentials stay in memory only; never persist Basic credentials in browser storage.
  private readonly credentials = signal<Credentials | null>(null);
  readonly isAuthenticated = computed(() => this.credentials() !== null);
  readonly username = computed(() => this.credentials()?.username ?? '');
  readonly role = computed(() => USER_ROLES[this.username().toLowerCase()] ?? '');

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<void> {
    const authorization = this.toBasicAuthorization({ username, password });
    const headers = new HttpHeaders({ Authorization: authorization });
    return this.http
      .get<AnalyticsResponse>(API_ENDPOINTS.statistics, { headers })
      .pipe(
        tap(() => this.credentials.set({ username, password })),
        map(() => undefined),
      );
  }

  logout(): void {
    this.credentials.set(null);
  }

  authorizationHeader(): string | null {
    const current = this.credentials();
    return current ? this.toBasicAuthorization(current) : null;
  }

  hasAnyRole(requiredRoles: readonly string[]): boolean {
    return requiredRoles.includes(this.role());
  }

  private toBasicAuthorization(credentials: Credentials): string {
    const bytes = new TextEncoder().encode(`${credentials.username}:${credentials.password}`);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return `Basic ${btoa(binary)}`;
  }
}
