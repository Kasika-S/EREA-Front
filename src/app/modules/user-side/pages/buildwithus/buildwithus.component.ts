import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
// import { Lightbox, LightboxConfig } from 'ngx-lightbox';

@Component({
  selector: 'app-buildwithus',
  standalone: true,
  imports: [NgClass],
  templateUrl: './buildwithus.component.html',
  styleUrl: './buildwithus.component.css'
})


export class BuildwithusComponent {
  // storeData: any;

  activeTab:string = 'all';

  items = [
      { src: '/assets/images/gallery-1.png', thumb: '/assets/images/gallery-1.png' },
      { src: '/assets/images/gallery-2.png', thumb: '/assets/images/gallery-2.png' },
      { src: '/assets/images/gallery-3.png', thumb: '/assets/images/gallery-3.png' },
      { src: '/assets/images/gallery-4.png', thumb: '/assets/images/gallery-4.png' },
      { src: '/assets/images/gallery-5.png', thumb: '/assets/images/gallery-5.png' },
  ];
  constructor() {
      // this.initStore();
  }
  // async initStore() {
  //     this.store
  //         .select((d) => d.index)
  //         .subscribe((d) => {
  //             this.storeData = d;
  //         });
  // }

}