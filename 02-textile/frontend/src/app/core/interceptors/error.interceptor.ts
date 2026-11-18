import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

function errorMessage(error: HttpErrorResponse): string {
  const payload: unknown = error.error;
  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    const message = payload.message;
    if (typeof message === 'string') {
      return message;
    }
  }
  return error.status === 0
    ? 'Le serveur est injoignable. Vérifiez la connexion et le partage CORS.'
    : 'Une erreur est survenue pendant la requête.';
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && auth.isAuthenticated()) {
          auth.logout();
          void router.navigate(['/login']);
        } else if (error.status !== 401) {
          snackBar.open(errorMessage(error), 'Fermer', { duration: 5000 });
        }
      }
      return throwError(() => error);
    }),
  );
};
