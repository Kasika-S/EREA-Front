import { Routes } from '@angular/router';
import { PetroleumProductsComponent } from './petroleum-products/petroleum-products.component';
import { PetroleumPriceComponent } from './petroleum-price/petroleum-price.component';
import { PetroleumVolumeComponent } from './petroleum-volume/petroleum-volume.component';

export default [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'petroleum',
    // },
    {
        path: 'products',
        component: PetroleumProductsComponent,
    },
    {
        path: 'price',
        component: PetroleumPriceComponent,
    },
    {
        path: 'import-volume',
        component: PetroleumVolumeComponent,
    },
] as Routes;
