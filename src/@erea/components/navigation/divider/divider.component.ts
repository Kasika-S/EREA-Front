import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FuseNavigationItem } from '../navigation.types';
import { Subject } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'vertical-navigation-divider-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss'
})

export class DividerComponent
    implements OnInit, OnDestroy
{
    private _changeDetectorRef = inject(ChangeDetectorRef);
    // private _fuseNavigationService = inject(FuseNavigationService);

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
}