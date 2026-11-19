import { ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FuseNavigationItem } from '../navigation.types';
import { Subject } from 'rxjs';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { IsActiveMatchOptions, RouterLink, RouterLinkActive } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vertical-navigation-basic-item',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    MatTooltipModule,
    NgTemplateOutlet,
    MatIconModule,
  ],  
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss'
})

export class BasicComponent
    implements OnInit, OnDestroy
{
    private _changeDetectorRef = inject(ChangeDetectorRef);
    // private _fuseNavigationService = inject(FuseNavigationService);
    // private _fuseUtilsService = inject(FuseUtilsService);

    @Input() item: FuseNavigationItem;
    @Input() name: string;

    // Set the equivalent of {exact: false} as default for active match options.
    // We are not assigning the item.isActiveMatchOptions directly to the
    // [routerLinkActiveOptions] because if it's "undefined" initially, the router
    // will throw an error and stop working.
    // isActiveMatchOptions: IsActiveMatchOptions =
    //     this._fuseUtilsService.subsetMatchOptions;
    isActiveMatchOptions: IsActiveMatchOptions = {
        paths: 'subset',
        queryParams: 'subset',
        matrixParams: 'ignored',
        fragment: 'ignored',
    };

    // private _fuseVerticalNavigationComponent: FuseVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Set the "isActiveMatchOptions" either from item's
        // "isActiveMatchOptions" or the equivalent form of
        // item's "exactMatch" option
        this.isActiveMatchOptions =
            this.item?.isActiveMatchOptions ??
            (this.item?.exactMatch
                ? {
                      paths: 'exact',
                      queryParams: 'exact',
                      matrixParams: 'ignored',
                      fragment: 'ignored',
                  }
                : {
                      paths: 'subset',
                      queryParams: 'subset',
                      matrixParams: 'ignored',
                      fragment: 'ignored',
                  });

        // Get the parent navigation component
        // this._fuseVerticalNavigationComponent =
        //     this._fuseNavigationService.getComponent(this.name);

        // Mark for check
        this._changeDetectorRef.markForCheck();

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
