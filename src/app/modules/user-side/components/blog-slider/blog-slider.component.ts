import { NgClass, NgFor, NgIf, } from '@angular/common';
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import SwiperCore from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';


//swiper
// import { SwiperModule } from 'swiper/types';

// install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

@Component({
  selector: 'blog-slider',
  standalone: true,
  imports: [NgClass, NgFor, NgIf ],
  templateUrl: './blog-slider.component.html',
  styleUrl: './blog-slider.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class BlogSliderComponent {
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() blogs: any[] = [
      {
          id: 1,
          thumbnail: '/assets/images/event4.jpg',
          title: 'UI/UX Design',
          excerpt: 'Simple & constructive methods to improve your visual/UI design',
          description:
              'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
      },
      {
          id: 2,
          thumbnail: '/assets/images/event6.jpg',
          title: 'Project Management',
          excerpt: 'Why is JIRA important for managing projects?',
          description:
              'Jira works well for Agile development projects for many reasons, including the ability to create Kanban and Scrum boards with sprint planning and issue time estimation capabilities.',
      },
      {
          id: 3,
          thumbnail: '/assets/images/event7.jpg',
          title: 'SEO Marketing',
          excerpt: 'What is SEO (Search Engine Optimization)?',
          description:
              'Search engine optimization is the process of improving the quality and quantity of website traffic to a website or a web page from search engines.',
      },
      {
        id: 4,
        thumbnail: '/assets/images/blog2.png',
        title: 'Project Management',
        excerpt: 'Why is chriss important for managing projects?',
        description:
            'Jira works well for Agile development projects for many reasons, including the ability to create Kanban and Scrum boards with sprint planning and issue time estimation capabilities.',
    },
  ];
  @Input() type: string = 'service';


  config: any = {
      loop: true,
      slidesPerView: 'auto',
      spaceBetween: 30,
      autoplay: {
          delay: 3000,
          disableOnInteraction: false,
      },
      navigation: {
          nextEl: '.blog-slider-button-next',
          prevEl: '.blog-slider-button-prev',
      },
      // modules: [Navigation, Autoplay],
      breakpoints: {
          640: {
              slidesPerView: 2,
          },
          1024: {
              slidesPerView: 3,
          },
      },
  };


  constructor() {}
}