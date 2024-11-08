import { Routes } from '@angular/router';
import { ElectricityAccessRateComponent } from './electricity-access-rate/electricity-access-rate.component';
import { ElectricityGovernanceIndexComponent } from './electricity-governance-index/electricity-governance-index.component';
import { ElectricityLossComponent } from './electricity-loss/electricity-loss.component';
import { ElectricityOutcomeIndexComponent } from './electricity-outcome-index/electricity-outcome-index.component';
import { ElectricityReguratoryIndexComponent } from './electricity-reguratory-index/electricity-reguratory-index.component';
import { ElectricitySubstanceIndexComponent } from './electricity-substance-index/electricity-substance-index.component';

export default [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'petroleum',
    // },
    {
        path: 'electricity-access-rate',
        component: ElectricityAccessRateComponent,
    },
    {
        path: 'electricity-governance-index',
        component: ElectricityGovernanceIndexComponent,
    },
    {
        path: 'electricity-loss',
        component: ElectricityLossComponent,
    },
    {
        path: 'electricity-outcome-index',
        component: ElectricityOutcomeIndexComponent,
    },
    {
        path: 'electricity-reguratory-index',
        component: ElectricityReguratoryIndexComponent,
    },
    {
        path: 'electricity-substance-index',
        component: ElectricitySubstanceIndexComponent,
    },
] as Routes;
