import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, forwardRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CollapsableComponent } from '../collapsable/collapsable.component';
import { BasicComponent } from '../basic/basic.component';
import { DividerComponent } from '../divider/divider.component';
import { SpacerComponent } from '../spacer/spacer.component';
import { BooleanInput } from '@angular/cdk/coercion';
import { FuseNavigationItem } from '../navigation.types';
import { Subject } from 'rxjs';

@Component({
  selector: 'vertical-navigation-group-item',
  standalone: true,
  imports: [
      NgClass,
      MatIconModule,
      BasicComponent,
      CollapsableComponent,
      DividerComponent,
      forwardRef(() => GroupComponent),
      SpacerComponent,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})

export class GroupComponent
    implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_autoCollapse: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    private _changeDetectorRef = inject(ChangeDetectorRef);
    // private _fuseNavigationService = inject(FuseNavigationService);

    @Input() autoCollapse: boolean;
    @Input() item: FuseNavigationItem;
    @Input() name: string;

    // private _fuseVerticalNavigationComponent: FuseVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the parent navigation component
        // this._fuseVerticalNavigationComponent =
        //     this._fuseNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        // this._fuseVerticalNavigationComponent.onRefreshed
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(() => {
        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
