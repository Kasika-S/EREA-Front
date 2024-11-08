import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
      {
            path: "",
            component: LayoutComponent,
            children: [
                  {
                        path: '', children: [
                              { path: 'petroleum', loadChildren: () => import('../app/modules/petroleum/petroleum.routes') },
                              { path: 'electricity', loadChildren: () => import('./modules/electricity/electricity.routes') },
                              { path: 'user-tariff', loadChildren: () => import('../app/modules/user-tariff/user-tariff.routes') },
                              { path: 'saidi', loadChildren: () => import('./modules/saidi/saidi.routes') },
                              { path: 'saifi', loadChildren: () => import('./modules/saifi/saifi.routes') },

                              { path: 'connected-customers', loadChildren: () => import('../app/modules/connected-customers/connected-customers.routes') },
                              { path: 'consumption-per-capital', loadChildren: () => import('./modules/consumption-per-capital/consumption-per-capital.routes') },
                              { path: 'effective-capacity', loadChildren: () => import('./modules/effective-capacity/effective-capacity.routes') },

                              { path: 'generation-mix', loadChildren: () => import('./modules/generation-mix/generation-mix.routes') },
                              { path: 'grid-connectivity', loadChildren: () => import('./modules/grid-connectivity/grid-connectivity.routes') },
                              { path: 'installed-capacity', loadChildren: () => import('./modules/installed-capacity/installed-capacity.routes') },
                              { path: 'maximum-demand', loadChildren: () => import('./modules/maximum-demand/maximum-demand.routes') },
                              { path: 'system-load-factor', loadChildren: () => import('./modules/system-load-factor/system-load-factor.routes') },
                        ]
                  },
            ]
      },
];
