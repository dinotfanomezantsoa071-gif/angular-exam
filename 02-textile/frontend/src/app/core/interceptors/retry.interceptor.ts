import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    retry({
      count: 2,
      delay: (error: unknown, retryCount: number) =>
        error instanceof HttpErrorResponse && error.status === 0
          ? timer(retryCount * 300)
          : throwError(() => error),
    }),
  );
