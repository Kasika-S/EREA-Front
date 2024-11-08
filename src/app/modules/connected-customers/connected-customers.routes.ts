import { Routes } from '@angular/router';
import { ConnectedCustomersComponent } from './connected-customers.component';

export default [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'petroleum',
    // },
    {
        path: '',
        component: ConnectedCustomersComponent,
    },
] as Routes;
