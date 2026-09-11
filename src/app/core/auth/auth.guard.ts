import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
    return true;
  }

  authService.signOut();
  return router.createUrlTree(['/auth/sign-in'], {
    queryParams: { redirectURL: state.url },
  });
};
