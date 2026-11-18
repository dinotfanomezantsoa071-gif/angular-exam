import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRoles: unknown = route.data['requiredRoles'];
  const roles = Array.isArray(requiredRoles)
    ? requiredRoles.filter((role): role is string => typeof role === 'string')
    : [];
  return auth.isAuthenticated() && auth.hasAnyRole(roles)
    ? true
    : router.createUrlTree(['/dashboard']);
};
