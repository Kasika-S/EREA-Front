import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';

export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  let request = req;

  if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
    request = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authService.accessToken}`),
    });
  }

  const isAuthRequest = req.url.includes('/api/login/') || req.url.includes('/api/token/refresh/');

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthRequest) {
        return authService.refreshAccessToken().pipe(
          switchMap((token) => next(req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          }))),
          catchError((refreshError) => {
            authService.signOut();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
