import { Routes } from '@angular/router';
import { UserTariffComponent } from './user-tariff.component';

export default [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'petroleum',
    // },
    {
        path: '',
        component: UserTariffComponent,
    },
] as Routes;
