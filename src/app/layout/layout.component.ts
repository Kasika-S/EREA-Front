import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from "@angular/router";
import { Subject } from "rxjs";
import { VerticalComponent } from "../../@erea/components/navigation/vertical/vertical.component";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'layout',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatIconModule,
    RouterOutlet,
    MatButtonModule,
    RouterLink,
    VerticalComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})

export class LayoutComponent implements OnInit, OnDestroy {
    isScreenSmall = false;
    @ViewChild('mainNavigation') mainNavigation?: VerticalComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private mediaQuery?: MediaQueryList;
    private readonly updateScreenSize = (): void => {
        this.isScreenSmall = this.mediaQuery?.matches ?? false;
    };

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _authService: AuthService,
        // private _navigationService: NavigationService,
        // private _fuseMediaWatcherService: FuseMediaWatcherService,
        // private _fuseNavigationService: FuseNavigationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.mediaQuery = window.matchMedia('(max-width: 959px)');
        this.updateScreenSize();
        this.mediaQuery.addEventListener('change', this.updateScreenSize);
        // Subscribe to navigation data
        // this._navigationService.navigation$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((navigation: Navigation) => {
        //         this.navigation = navigation;
        //     });

        // // Subscribe to media changes
        // this._fuseMediaWatcherService.onMediaChange$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(({ matchingAliases }) => {
        //         // Check if the screen is small
        //         this.isScreenSmall = !matchingAliases.includes('md');
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.mediaQuery?.removeEventListener('change', this.updateScreenSize);
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        this.mainNavigation?.toggle();
    }


    goToHome() {
        this._router.navigate(['/']); // Replace '/home' with the actual route for your homepage
    }

    signOut(): void {
        localStorage.removeItem('ereaMemberSession');
        this._authService.signOut().subscribe(() => this._router.navigate(['/auth/sign-in']));
    }
}
