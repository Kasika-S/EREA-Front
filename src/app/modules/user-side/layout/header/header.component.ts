import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';


@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
    storeData: any;
    showMenu = false;
    isMemberSession = localStorage.getItem('ereaMemberSession') === 'true';

    constructor( public router: Router, private cdr: ChangeDetectorRef) {
    }


    // Mobile menu js
    toggleMenu() {
        if (window.innerWidth < 1024) {
            this.showMenu = !this.showMenu;
            console.log(this.showMenu);
            this.cdr.detectChanges();
        } else {
            this.showMenu = false;
            console.log("False" +this.showMenu);
        }
    }

    openPdf() {
        window.open("assets/pdf/company_profile.pdf", '_blank');
      }

}
