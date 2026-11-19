import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';


export const workspaceGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.role === 'super_admin' || authService.role === 'data_clerk') {
    return true;
  }

  return router.createUrlTree(['/chart/electricity']);
};
