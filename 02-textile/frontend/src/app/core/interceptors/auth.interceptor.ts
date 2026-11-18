import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authorization = inject(AuthService).authorizationHeader();
  return authorization
    ? next(request.clone({ setHeaders: { Authorization: authorization } }))
    : next(request);
};
