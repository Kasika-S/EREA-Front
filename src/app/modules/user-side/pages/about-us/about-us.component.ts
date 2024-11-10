import { Component } from '@angular/core';
import { BlogSliderComponent } from '../../components/blog-slider/blog-slider.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [BlogSliderComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

  storeData: any;
  constructor() {
  }

}
