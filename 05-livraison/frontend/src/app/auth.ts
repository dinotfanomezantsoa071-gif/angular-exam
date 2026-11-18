import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly credentials = signal('');
  private loginAttempt = false;

  readonly isAuthenticated = computed(() => this.credentials().length > 0);
  readonly authorizationHeader = computed(() => {
    const encoded = this.credentials();
    return encoded ? `Basic ${encoded}` : '';
  });
  readonly username = computed(() => {
    const raw = this.credentials();
    if (!raw) return '';
    try {
      return atob(raw).split(':', 1)[0] ?? '';
    } catch {
      return '';
    }
  });
  readonly roleLabel = computed(() => {
    const user = this.username().toLowerCase();
    return user === 'admin' ? 'Administrateur' : user === 'manager' ? 'Responsable' :
      user === 'operator' ? 'Opérateur' : 'Utilisateur';
  });
  readonly isAdmin = computed(() => this.username().toLowerCase() === 'admin');
  readonly canManage = computed(() => ['admin', 'manager'].includes(this.username().toLowerCase()));
  readonly canOperate = computed(() =>
    ['admin', 'manager', 'operator'].includes(this.username().toLowerCase()));

  login(username: string, password: string) {
    const bytes = new TextEncoder().encode(`${username.trim()}:${password}`);
    const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
    const encoded = btoa(binary);
    this.credentials.set(encoded);
    this.loginAttempt = true;
    return this.http.get('/api/statistics').pipe(
      map(() => {
        this.loginAttempt = false;
        return true;
      }),
      catchError(() => {
        this.loginAttempt = false;
        this.credentials.set('');
        return of(false);
      })
    );
  }

  logout(): void {
    this.loginAttempt = false;
    this.credentials.set('');
  }

  handleUnauthorized(): void {
    if (!this.loginAttempt && this.isAuthenticated()) {
      this.logout();
      void this.router.navigate(['/login'], { queryParams: { expired: '1' } });
    }
  }
}

export const basicAuthInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const authorization = auth.authorizationHeader();
  const outgoing = authorization
    ? request.clone({ setHeaders: { Authorization: authorization } })
    : request;
  return next(outgoing).pipe(
    catchError((error: unknown) => {
      if (typeof error === 'object' && error !== null && 'status' in error &&
        (error as { status: number }).status === 401) {
        auth.handleUnauthorized();
      }
      throw error;
    })
  );
};

export function authenticatedGuard() {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
}

export function adminGuard() {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAdmin() ? true : router.createUrlTree(['/dashboard']);
}

export function loginGuard() {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? router.createUrlTree(['/dashboard']) : true;
}
