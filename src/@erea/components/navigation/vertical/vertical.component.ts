import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, inject, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { FuseNavigationItem, FuseVerticalNavigationAppearance, FuseVerticalNavigationMode, FuseVerticalNavigationPosition } from '../navigation.types';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import {
  animate,
  AnimationBuilder,
  AnimationPlayer,
  style,
} from '@angular/animations';
import { BasicComponent } from '../basic/basic.component';
import { CollapsableComponent } from '../collapsable/collapsable.component';
import { DividerComponent } from '../divider/divider.component';
import { GroupComponent } from '../group/group.component';
import { SpacerComponent } from '../spacer/spacer.component';
// import { FuseScrollbarDirective } from '../@erea/directives/scrollbar/scrollbar.directive';
import { AsideComponent } from '../aside/aside.component';
import { FuseScrollbarDirective } from '../../../directives/scrollbar';


@Component({
  selector: 'vertical-navigation',
  standalone: true,
  imports: [
    FuseScrollbarDirective,
    AsideComponent,
    BasicComponent,
    CollapsableComponent,
    DividerComponent,
    GroupComponent,
    SpacerComponent
  ],  templateUrl: './vertical.component.html',
  styleUrl: './vertical.component.scss'
})


export class VerticalComponent implements AfterViewInit{

  /* eslint-disable @typescript-eslint/naming-convention */
  static ngAcceptInputType_inner: BooleanInput;
  static ngAcceptInputType_opened: BooleanInput;
  static ngAcceptInputType_transparentOverlay: BooleanInput;
  /* eslint-enable @typescript-eslint/naming-convention */

  legacyNavigation: FuseNavigationItem[] = [
    // {
    //     id: 'dashboards',
    //     title: 'Dashboards',
    //     subtitle: 'Unique dashboard designs',
    //     type: 'group',
    //     icon: 'heroicons_outline:home',
    //     children: [
    //         {
    //             id: 'dashboards.project',
    //             title: 'Project',
    //             type: 'basic',
    //             icon: 'heroicons_outline:clipboard-document-check',
    //             link: '/admin/dashboards/project',
    //         },
    //         {
    //             id: 'dashboards.analytics',
    //             title: 'Analytics',
    //             type: 'basic',
    //             icon: 'heroicons_outline:chart-pie',
    //             link: '/admin/dashboards/analytics',
    //         },
    //         {
    //             id: 'dashboards.finance',
    //             title: 'Finance',
    //             type: 'basic',
    //             icon: 'heroicons_outline:banknotes',
    //             link: '/admin/dashboards/finance',
    //         },
    //         {
    //             id: 'dashboards.crypto',
    //             title: 'Crypto',
    //             type: 'basic',
    //             icon: 'heroicons_outline:currency-dollar',
    //             link: '/admin/dashboards/crypto',
    //         },
    //     ],
    // },
    {
        id: 'apps',
        title: 'Entry',
        subtitle: 'Input data for data visualization',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'apps.ecommerce',
                title: 'Petroleum',
                type: 'collapsable',
                icon: 'heroicons_outline:clipboard-document-check',
                children: [
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Petroleum Product',
                        type: 'basic',
                        link: '/admin/petroleum/products',
                    },
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Petroleum Price',
                        type: 'basic',
                        link: '/admin/petroleum/price',
                    },
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Volume of Imports',
                        type: 'basic',
                        link: '/admin/petroleum/import-volume',
                    },
                ],
            },
            {
                id: 'apps.academy',
                title: 'User Tariff',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/user-tariff',
            },
            {
                id: 'apps.academy',
                title: 'Generation Mix',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/generation-mix',
            },
            {
                id: 'apps.electricity',
                title: 'Electricity',
                type: 'collapsable',
                icon: 'heroicons_outline:clipboard-document-check',
                children: [
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Electricity Loss',
                        type: 'basic',
                        link: '/admin/electricity/electricity-loss',
                    },
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Electricity Regulatory Index',
                        type: 'basic',
                        link: '/admin/electricity/electricity-reguratory-index',
                    },
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Electricity Governance Index',
                        type: 'basic',
                        link: '/admin/electricity/electricity-governance-index',
                    },
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Electricity Substance Index',
                        type: 'basic',
                        link: '/admin/electricity/electricity-substance-index',
                    },
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Electricity Outcome Index',
                        type: 'basic',
                        link: '/admin/electricity/electricity-outcome-index',
                    },
                    {
                        id: 'apps.ecommerce.inventory',
                        title: 'Electricity Access Rate',
                        type: 'basic',
                        link: '/admin/electricity/electricity-access-rate',
                    },
                ],
            },
            {
                id: 'apps.academy',
                title: 'SAIDI',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/saidi',
            },
            {
                id: 'apps.academy',
                title: 'SAIFI',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/saifi',
            },
            {
                id: 'apps.academy',
                title: 'Installed Capacity',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/installed-capacity',
            },
            {
                id: 'apps.academy',
                title: 'Maximum Demand',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/maximum-demand',
            },
            {
                id: 'apps.academy',
                title: 'Grid Connectivity',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/grid-connectivity',
            },
            {
                id: 'apps.academy',
                title: 'Effective Capacity',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/effective-capacity',
            },
            {
                id: 'apps.academy',
                title: 'Number Of Connected Customers',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/connected-customers',
            },
            {
                id: 'apps.academy',
                title: 'System Load Factor',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/system-load-factor',
            },
            {
                id: 'apps.academy',
                title: 'Consumption PerCapital',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/consumption-per-capital',
            },
        
        ],
    },
];

  navigation: FuseNavigationItem[] = [
    {
      id: 'workspace',
      title: 'WORKSPACE',
      type: 'group',
      children: [
        {
          id: 'workspace.overview',
          title: 'Overview',
          type: 'basic',
          icon: 'heroicons_outline:squares-2x2',
          link: '/admin',
        },
      ],
    },
    {
      id: 'energy-data',
      title: 'ENERGY DATA',
      subtitle: 'Select a dataset to manage',
      type: 'group',
      children: [
        {
          id: 'energy-data.petroleum',
          title: 'Petroleum',
          type: 'collapsable',
          icon: 'heroicons_outline:beaker',
          children: [
            { id: 'petroleum.products', title: 'Product catalogue', type: 'basic', link: '/admin/petroleum/products' },
            { id: 'petroleum.prices', title: 'Petroleum prices', type: 'basic', link: '/admin/petroleum/price' },
            { id: 'petroleum.imports', title: 'Volume of imports', type: 'basic', link: '/admin/petroleum/import-volume' },
          ],
        },
        {
          id: 'energy-data.electricity',
          title: 'Electricity quality',
          type: 'collapsable',
          icon: 'heroicons_outline:bolt',
          children: [
            { id: 'electricity.loss', title: 'Electricity loss', type: 'basic', link: '/admin/electricity/electricity-loss' },
            { id: 'electricity.access', title: 'Access rate', type: 'basic', link: '/admin/electricity/electricity-access-rate' },
            { id: 'electricity.regulation', title: 'Regulatory index', type: 'basic', link: '/admin/electricity/electricity-reguratory-index' },
            { id: 'electricity.governance', title: 'Governance index', type: 'basic', link: '/admin/electricity/electricity-governance-index' },
            { id: 'electricity.substance', title: 'Substance index', type: 'basic', link: '/admin/electricity/electricity-substance-index' },
            { id: 'electricity.outcome', title: 'Outcome index', type: 'basic', link: '/admin/electricity/electricity-outcome-index' },
          ],
        },
        {
          id: 'energy-data.power-system',
          title: 'Power system',
          type: 'collapsable',
          icon: 'heroicons_outline:circle-stack',
          children: [
            { id: 'power.generation-mix', title: 'Generation mix', type: 'basic', link: '/admin/generation-mix' },
            { id: 'power.installed-capacity', title: 'Installed capacity', type: 'basic', link: '/admin/installed-capacity' },
            { id: 'power.effective-capacity', title: 'Effective capacity', type: 'basic', link: '/admin/effective-capacity' },
            { id: 'power.maximum-demand', title: 'Maximum demand', type: 'basic', link: '/admin/maximum-demand' },
            { id: 'power.grid-connectivity', title: 'Grid connectivity', type: 'basic', link: '/admin/grid-connectivity' },
          ],
        },
        {
          id: 'energy-data.service-demand',
          title: 'Service and demand',
          type: 'collapsable',
          icon: 'heroicons_outline:chart-bar-square',
          children: [
            { id: 'service.user-tariff', title: 'User tariff', type: 'basic', link: '/admin/user-tariff' },
            { id: 'service.saidi', title: 'SAIDI', type: 'basic', link: '/admin/saidi' },
            { id: 'service.saifi', title: 'SAIFI', type: 'basic', link: '/admin/saifi' },
            { id: 'service.customers', title: 'Connected customers', type: 'basic', link: '/admin/connected-customers' },
            { id: 'service.load-factor', title: 'System load factor', type: 'basic', link: '/admin/system-load-factor' },
            { id: 'service.consumption', title: 'Consumption per capita', type: 'basic', link: '/admin/consumption-per-capital' },
          ],
        },
      ],
    },
  ];

  private _animationBuilder = inject(AnimationBuilder);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _document = inject(DOCUMENT);
  private _elementRef = inject(ElementRef);
  private _renderer2 = inject(Renderer2);
  private _router = inject(Router);
  private _scrollStrategyOptions = inject(ScrollStrategyOptions);

  @Input() appearance: FuseVerticalNavigationAppearance = 'default';
  @Input() autoCollapse: boolean = true;
  @Input() inner: boolean = false;
  @Input() mode: FuseVerticalNavigationMode = 'side';
  // @Input() name: string = this._fuseUtilsService.randomId();
  @Input() name: string = "3444443";
  @Input() opened: boolean = true;
  @Input() position: FuseVerticalNavigationPosition = 'left';
  @Input() transparentOverlay: boolean = false;

  @Output() readonly openedChanged: EventEmitter<boolean> =
  new EventEmitter<boolean>();
  @ViewChild('navigationContent') private _navigationContentEl!: ElementRef;

  activeAsideItemId: string | null = null;
  onCollapsableItemCollapsed: ReplaySubject<FuseNavigationItem> =
      new ReplaySubject<FuseNavigationItem>(1);
  onCollapsableItemExpanded: ReplaySubject<FuseNavigationItem> =
      new ReplaySubject<FuseNavigationItem>(1);
  onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private _animationsEnabled: boolean = false;
  private _asideOverlay!: HTMLElement;
  private readonly _handleAsideOverlayClick: any;
  private readonly _handleOverlayClick: any;
  private _hovered: boolean = false;
  private _mutationObserver!: MutationObserver;
  private _overlay!: HTMLElement;
  private _player!: AnimationPlayer;
  private _scrollStrategy: ScrollStrategy =
  this._scrollStrategyOptions.block();


      // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            'fuse-vertical-navigation-animations-enabled':
                this._animationsEnabled,
            [`fuse-vertical-navigation-appearance-${this.appearance}`]: true,
            'fuse-vertical-navigation-hover': this._hovered,
            'fuse-vertical-navigation-inner': this.inner,
            'fuse-vertical-navigation-mode-over': this.mode === 'over',
            'fuse-vertical-navigation-mode-side': this.mode === 'side',
            'fuse-vertical-navigation-opened': this.opened,
            'fuse-vertical-navigation-position-left': this.position === 'left',
            'fuse-vertical-navigation-position-right':
                this.position === 'right',
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    /**
     * Host binding for component inline styles
     */
    @HostBinding('style') get styleList(): any {
        return {
            visibility: this.opened ? 'visible' : 'hidden',
        };
    }

    /**
     * Setter for fuseScrollbarDirectives
     */
    // @ViewChildren(FuseScrollbarDirective)
    // set fuseScrollbarDirectives(
    //     fuseScrollbarDirectives: QueryList<FuseScrollbarDirective>
    // ) {
    //     // Store the directives
    //     this._fuseScrollbarDirectives = fuseScrollbarDirectives;

    //     // Return if there are no directives
    //     if (fuseScrollbarDirectives.length === 0) {
    //         return;
    //     }

    //     // Unsubscribe the previous subscriptions
    //     if (this._fuseScrollbarDirectivesSubscription) {
    //         this._fuseScrollbarDirectivesSubscription.unsubscribe();
    //     }

    //     // Update the scrollbars on collapsable items' collapse/expand
    //     this._fuseScrollbarDirectivesSubscription = merge(
    //         this.onCollapsableItemCollapsed,
    //         this.onCollapsableItemExpanded
    //     )
    //         .pipe(takeUntil(this._unsubscribeAll), delay(250))
    //         .subscribe(() => {
    //             // Loop through the scrollbars and update them
    //             fuseScrollbarDirectives.forEach((fuseScrollbarDirective) => {
    //                 fuseScrollbarDirective.update();
    //             });
    //         });
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Decorated methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On mouseenter
     *
     * @private
     */
    @HostListener('mouseenter')
    private _onMouseenter(): void {
        // Enable the animations
        this._enableAnimations();

        // Set the hovered
        this._hovered = true;
    }

    /**
     * On mouseleave
     *
     * @private
     */
    @HostListener('mouseleave')
    private _onMouseleave(): void {
        // Enable the animations
        this._enableAnimations();

        // Set the hovered
        this._hovered = false;
    }

      /**
     * After view init
     */
      ngAfterViewInit(): void {
        // Fix for Firefox.
        //
        // Because 'position: sticky' doesn't work correctly inside a 'position: fixed' parent,
        // adding the '.cdk-global-scrollblock' to the html element breaks the navigation's position.
        // This fixes the problem by reading the 'top' value from the html element and adding it as a
        // 'marginTop' to the navigation itself.
        this._mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const mutationTarget = mutation.target as HTMLElement;
                if (mutation.attributeName === 'class') {
                    if (
                        mutationTarget.classList.contains(
                            'cdk-global-scrollblock'
                        )
                    ) {
                        const top = parseInt(mutationTarget.style.top, 10);
                        this._renderer2.setStyle(
                            this._elementRef.nativeElement,
                            'margin-top',
                            `${Math.abs(top)}px`
                        );
                    } else {
                        this._renderer2.setStyle(
                            this._elementRef.nativeElement,
                            'margin-top',
                            null
                        );
                    }
                }
            });
        });
        this._mutationObserver.observe(this._document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        setTimeout(() => {
            // Return if 'navigation content' element does not exist
            if (!this._navigationContentEl) {
                return;
            }

            // If 'navigation content' element doesn't have
            // perfect scrollbar activated on it...
            if (
                !this._navigationContentEl.nativeElement.classList.contains(
                    'ps'
                )
            ) {
                // Find the active item
                const activeItem =
                    this._navigationContentEl.nativeElement.querySelector(
                        '.fuse-vertical-navigation-item-active'
                    );

                // If the active item exists, scroll it into view
                if (activeItem) {
                    activeItem.scrollIntoView();
                }
            }
            // Otherwise
            else {
                // Go through all the scrollbar directives
                // this._fuseScrollbarDirectives.forEach(
                //     (fuseScrollbarDirective) => {
                //         // Skip if not enabled
                //         if (!fuseScrollbarDirective.isEnabled()) {
                //             return;
                //         }

                //         // Scroll to the active element
                //         fuseScrollbarDirective.scrollToElement(
                //             '.fuse-vertical-navigation-item-active',
                //             -120,
                //             true
                //         );
                //     }
                // );
            }
        });
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Refresh the component to apply the changes
     */
    refresh(): void {
      // Mark for check
      this._changeDetectorRef.markForCheck();

      // Execute the observable
      this.onRefreshed.next(true);
  }

  /**
   * Open the navigation
   */
  open(): void {
      // Return if the navigation is already open
      if (this.opened) {
          return;
      }

      // Set the opened
      this._toggleOpened(true);
  }

  /**
   * Close the navigation
   */
  close(): void {
      // Return if the navigation is already closed
      if (!this.opened) {
          return;
      }

      // Close the aside
      this.closeAside();

      // Set the opened
      this._toggleOpened(false);
  }

  /**
   * Toggle the navigation
   */
  toggle(): void {
      // Toggle
      if (this.opened) {
          this.close();
      } else {
          this.open();
      }
  }

  /**
   * Open the aside
   *
   * @param item
   */
  openAside(item: FuseNavigationItem): void {
      // Return if the item is disabled
      if (item.disabled || !item.id) {
          return;
      }

      // Open
      this.activeAsideItemId = item.id;

      // Show the aside overlay
      this._showAsideOverlay();

      // Mark for check
      this._changeDetectorRef.markForCheck();
  }

  /**
   * Close the aside
   */
  closeAside(): void {
      // Close
      this.activeAsideItemId = null;

      // Hide the aside overlay
      this._hideAsideOverlay();

      // Mark for check
      this._changeDetectorRef.markForCheck();
  }

  /**
   * Toggle the aside
   *
   * @param item
   */
  toggleAside(item: FuseNavigationItem): void {
      // Toggle
      if (this.activeAsideItemId === item.id) {
          this.closeAside();
      } else {
          this.openAside(item);
      }
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
      return item.id || index;
  }


  // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Enable the animations
     *
     * @private
     */
    private _enableAnimations(): void {
      // Return if the animations are already enabled
      if (this._animationsEnabled) {
          return;
      }

      // Enable the animations
      this._animationsEnabled = true;
  }

  /**
   * Disable the animations
   *
   * @private
   */
  private _disableAnimations(): void {
      // Return if the animations are already disabled
      if (!this._animationsEnabled) {
          return;
      }

      // Disable the animations
      this._animationsEnabled = false;
  }

  /**
   * Show the overlay
   *
   * @private
   */
  private _showOverlay(): void {
      // Return if there is already an overlay
      if (this._asideOverlay) {
          return;
      }

      // Create the overlay element
      this._overlay = this._renderer2.createElement('div');

      // Add a class to the overlay element
      this._overlay.classList.add('fuse-vertical-navigation-overlay');

      // Add a class depending on the transparentOverlay option
      if (this.transparentOverlay) {
          this._overlay.classList.add(
              'fuse-vertical-navigation-overlay-transparent'
          );
      }

      // Append the overlay to the parent of the navigation
      this._renderer2.appendChild(
          this._elementRef.nativeElement.parentElement,
          this._overlay
      );

      // Enable block scroll strategy
      this._scrollStrategy.enable();

      // Create the enter animation and attach it to the player
      this._player = this._animationBuilder
          .build([
              animate(
                  '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                  style({ opacity: 1 })
              ),
          ])
          .create(this._overlay);

      // Play the animation
      this._player.play();

      // Add an event listener to the overlay
      this._overlay.addEventListener('click', this._handleOverlayClick);
  }

  /**
   * Hide the overlay
   *
   * @private
   */
  private _hideOverlay(): void {
      if (!this._overlay) {
          return;
      }

      // Create the leave animation and attach it to the player
      this._player = this._animationBuilder
          .build([
              animate(
                  '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                  style({ opacity: 0 })
              ),
          ])
          .create(this._overlay);

      // Play the animation
      this._player.play();

      // Once the animation is done...
      this._player.onDone(() => {
          // If the overlay still exists...
          if (this._overlay) {
              // Remove the event listener
              this._overlay.removeEventListener(
                  'click',
                  this._handleOverlayClick
              );

              // Remove the overlay
              // this._overlay.parentNode.removeChild(this._overlay);
              // this._overlay = null;
          }

          // Disable block scroll strategy
          this._scrollStrategy.disable();
      });
  }

  /**
   * Show the aside overlay
   *
   * @private
   */
  private _showAsideOverlay(): void {
      // Return if there is already an overlay
      if (this._asideOverlay) {
          return;
      }

      // Create the aside overlay element
      this._asideOverlay = this._renderer2.createElement('div');

      // Add a class to the aside overlay element
      this._asideOverlay.classList.add(
          'fuse-vertical-navigation-aside-overlay'
      );

      // Append the aside overlay to the parent of the navigation
      this._renderer2.appendChild(
          this._elementRef.nativeElement.parentElement,
          this._asideOverlay
      );

      // Create the enter animation and attach it to the player
      this._player = this._animationBuilder
          .build([
              animate(
                  '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                  style({ opacity: 1 })
              ),
          ])
          .create(this._asideOverlay);

      // Play the animation
      this._player.play();

      // Add an event listener to the aside overlay
      this._asideOverlay.addEventListener(
          'click',
          this._handleAsideOverlayClick
      );
  }

  /**
   * Hide the aside overlay
   *
   * @private
   */
  private _hideAsideOverlay(): void {
      if (!this._asideOverlay) {
          return;
      }

      // Create the leave animation and attach it to the player
      this._player = this._animationBuilder
          .build([
              animate(
                  '300ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                  style({ opacity: 0 })
              ),
          ])
          .create(this._asideOverlay);

      // Play the animation
      this._player.play();

      // Once the animation is done...
      this._player.onDone(() => {
          // If the aside overlay still exists...
          if (this._asideOverlay) {
              // Remove the event listener
              this._asideOverlay.removeEventListener(
                  'click',
                  this._handleAsideOverlayClick
              );

              // Remove the aside overlay
              // this._asideOverlay.parentNode.removeChild(this._asideOverlay);
              // this._asideOverlay = null;
          }
      });
  }

  /**
   * Open/close the navigation
   *
   * @param open
   * @private
   */
  private _toggleOpened(open: boolean): void {
      // Set the opened
      this.opened = open;

      // Enable the animations
      this._enableAnimations();

      // If the navigation opened, and the mode
      // is 'over', show the overlay
      if (this.mode === 'over') {
          if (this.opened) {
              this._showOverlay();
          } else {
              this._hideOverlay();
          }
      }

      // Execute the observable
      this.openedChanged.next(open);
  }

}
