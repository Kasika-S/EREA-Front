import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SwiperOptions } from 'swiper/types';


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  storeData: any;
  // @ViewChild('modal') modal: any | undefined;
  // config: SwiperOptions = {
  //     loop: true,
  //     slidesPerView: 'auto',
  //     spaceBetween: 30,
  //     speed: 2500,
  //     autoplay: {
  //         delay: 0,
  //         disableOnInteraction: false,
  //     },
  //     modules: [Autoplay],
  //     breakpoints: {
  //         320: {
  //             slidesPerView: 1.7,
  //         },
  //         600: {
  //             slidesPerView: 3,
  //         },
  //         1000: {
  //             slidesPerView: 5,
  //         },
  //         1600: {
  //             slidesPerView: 8,
  //         },
  //     },
  // };
  constructor() {  }

}
