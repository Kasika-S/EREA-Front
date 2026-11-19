import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
import { FooterComponent } from '../layout/footer/footer.component';
import { HeaderComponent } from '../layout/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    FooterComponent, 
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})


export class HomeComponent implements OnInit {
  storeData: any;
  showTopButton = false;

  headerClass = '';
  ngOnInit() {
      window.addEventListener('scroll', () => {
          if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
              this.showTopButton = true;
              this.headerClass = 'sticky-header';
          } else {
              this.showTopButton = false;
              this.headerClass = '';
          }
      });

      // aos animation
      AOS.init({
          once: true,
      });

  }

  ngOnDestroy() {
      window.removeEventListener('scroll', () => {});
  }



  scrollToTop() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
  }
}