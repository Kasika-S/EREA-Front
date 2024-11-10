import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogSliderComponent } from '../../components/blog-slider/blog-slider.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [BlogSliderComponent, RouterLink],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements AfterViewInit{
  storeData: any;
  activeTab = 'all';

  @ViewChild('textElement', { static: false }) textElement!: ElementRef;

  words: string[] = ['Innovation', 'Creativity', 'Support']; // Add your words here
  currentWordIndex = 0;
  currentWord = this.words[0];
  // state = 'hidden';

//   constructor(public store: Store<any>, private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) {
//     // this.initStore();
// }

constructor(private renderer: Renderer2) {
  // this.initStore();
}

// async initStore() {
//     this.store
//         .select((d) => d.index)
//         .subscribe((d) => {
//             this.storeData = d;
//         });
// }

  ngAfterViewInit() {
    this.cycleWords();
  }

  cycleWords() {
    this.animateTypewriter();
  }

  animateTypewriter() {

    // this.changeDetectorRef.detectChanges()

    const text = this.words[this.currentWordIndex];
    const element = this.textElement.nativeElement;

    this.renderer.setProperty(element, 'innerText', '');
  //   this.state = 'hidden';
     
    for (let i = 0; i < text.length; i++) {
      setTimeout(() => {
        this.renderer.setProperty(element, 'innerText', text.slice(0, i + 1));
        if (i === text.length - 1) {
          // this.state = 'visible';
          setTimeout(() => {
          //   this.state = 'hidden';
            if (this.currentWordIndex === this.words.length - 1) {
              this.currentWordIndex = 0;
            } else {
              this.currentWordIndex++;
            }
            this.animateTypewriter();
          }, 1000); // Wait for 1 second before starting the next word
        }
      }, 500 * i);
    }
  }
}
