import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogSliderComponent } from '../../components/blog-slider/blog-slider.component';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import * as africaMap from "./africa-geojson.json"
import { GenerationMixChartComponent } from '../charts/generation-mix/generation-mix.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NonCollapsableService } from '../../../../core/services/non-collapsable.service';

interface Year {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [BlogSliderComponent, RouterLink, NgxEchartsDirective,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
  providers: [
    provideEcharts(),
  ]
})
export class IndexComponent implements AfterViewInit, OnInit{
  storeData: any;
  activeTab = 'all';

  mapOptions: EChartsOption = {};
  mapData: any = africaMap;


  @ViewChild('textElement', { static: false }) textElement!: ElementRef;

  words: string[] = ['Energy Data', 'Transparency', 'Interoperability','Regional Cooperation','Sustainability','Sustainability','Knowledge Sharing']; // Add your words here
  currentWordIndex = 0;
  currentWord = this.words[0];
  // state = 'hidden';

//   constructor(public store: Store<any>, private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) {
//     // this.initStore();
// }



constructor(private renderer: Renderer2, private nonCollapsableService: NonCollapsableService){}
 
selectedYear: string = new Date().getFullYear().toString();
 
chartOption: EChartsOption;
xData:any;
yData:any;
dataPresent:any;

  ngAfterViewInit() {
    this.cycleWords();

  }

  ngOnInit(): void {
    this.getConsumptionPerCapita(this.selectedYear);
    this.getConnectedCustomers(this.selectedYear,"")

  }

  year: Year[] = [
    {value: '2025', viewValue: '2025'},
    {value: '2024', viewValue: '2024'},
    {value: '2023', viewValue: '2023'},
    {value: '2022', viewValue: '2022'},
  ];

  onYearChange(event: MatSelectChange) {
    console.log('Year selected:', event.value)
    this.getConnectedCustomers(event.value, "")
  }

  getConnectedCustomers(year:string, product:any) {
    this.nonCollapsableService.getConnectedCustomersSum(year).subscribe(
      {
        next: (response) => {
          this.dataPresent = response
          this.xData = response.map((item: { country: any; }) => item.country);
          this.yData = response.map((item: { total_connected_customers: any; }) => item.total_connected_customers);
          console.log("testing data", this.dataPresent.length)
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          this.chartOption = {
          //   title: {
          //     text: 'Basic Bar Chart with Labels',
          //     left: 'center'
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow' // Shows a shadow line for the bar
            }
        },
            xAxis: {
              type: 'category',
              data: this.xData,
              name: 'Country',             // Label for x-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameTextStyle: {
              fontWeight: 'bold',
              padding: 20             // Padding to adjust distance from the axis
        }
            },
            yAxis: {
              type: 'value',
              name: 'Connected Users (In Millions)',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                name: 'Connected Users',
                data: this.yData,
                type: 'bar',
                label: {
                  show: true,
                  position: 'top', // Position labels on top of the bars
                  color: '#000',   // Customize label color
                  fontWeight: 'bold',
                  fontSize: 12
              },
              itemStyle: {
                color: '#264a7d', // Customize bar color
                borderRadius: [4, 4, 0, 0] // Rounded top corners for bars
            }
              }
            ]
          };
        }
      }
    )
  }

  getConsumptionPerCapita(year:string) {
    this.nonCollapsableService.getConsumptionPerCapitalSum(year).subscribe(
      {
        next: (response) => {
          // this.dataPresent = response
          this.xData = response.map((item: { country: any; }) => item.country);

          this.dataPresent = response.map((item: { country: any; total_consumption_per_capita: any; }) => 
            ({
            name: item.country,
            value: item.total_consumption_per_capita,
            itemStyle: {
              areaColor: '#2cdb46'
            }
            })
        )

          console.log("testing map", this.dataPresent)
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          echarts.registerMap('africa', this.mapData);

          this.mapOptions = {
      
            title: {
              text: 'East Africa',
              subtext: 'Number',
              left: 'right',
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c}',
            },
            // toolbox: {
            //   show: true,
            //   left: 'left',
            //   top: 'top',
            //   feature: {
            //     dataView: { readOnly: false },
            //     restore: {},
            //     saveAsImage: {}
            //   }
            // },
            toolbox: {
              show: true,
              orient: 'vertical',
              left: 'right',
              top: 'center',
              feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
              }
            },
            series: [
              {
                name: 'East Africa Estimates',
                type: 'map',
                roam: false,
                map: 'africa', // Ensure the Africa map is loaded correctly
                emphasis: {
                  label: {
                    show: true
                  }
                },
                label: {
                  show: true
                },
                data: this.dataPresent
              }
            ]
          };
        }
      }
    )
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
