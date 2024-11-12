import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

import { PetroleumService } from '../../../../../core/services/petroleum.service';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NonCollapsableService } from '../../../../../core/services/non-collapsable.service';


interface Year {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-saifi',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective,
    FormsModule,
    MatIconModule,
    NgClass,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule
],
  templateUrl: './saifi.component.html',
  styleUrl: './saifi.component.scss',
  providers: [
    provideEcharts(),
  ]
})


export class SaifiChartComponent implements OnInit{
  selectedYear: string = "2024";
  selectedCountry: string;

  chartOption: EChartsOption;
  xData:any;
  yData:any;
  isDataPresent:any;

  petroleumProduct: any[] = [];

  //PAGINATION
  totalItems: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;

  searchCountry: string = '';
  country: any[] = [];

  constructor(private nonCollapsableService: NonCollapsableService, private petroleumService: PetroleumService){}

  ngOnInit(): void {
    this.getSaifi(this.selectedYear,"")
  }

  year: Year[] = [
    {value: '2024', viewValue: '2024'},
    {value: '2023', viewValue: '2023'},
    {value: '2022', viewValue: '2022'},
  ];

  onYearChange(event: MatSelectChange) {
    console.log('Year selected:', event.value)
    this.getSaifi(event.value, "")
  }

  getCountry(event: Event) {
    if(true){
      this.pageNumber = 1
      this.searchCountry = (event.target as HTMLInputElement).value
    }
    this.nonCollapsableService.getCountry(this.pageNumber, this.pageSize,this.searchCountry).subscribe(
      {
        next: (response) => {
          this.country = response.results
          this.totalItems = response.count
          this.pageNumber = response.page_number
          this.pageSize = response.page_size
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          // this.isLoading = false
        }
      }
    )
  }
  
  onCountrySelected(event: MatAutocompleteSelectedEvent) {
    const selectedCountry = event.option.value;
    console.log('Selected product:', selectedCountry);
    console.log('Selected product 2:', selectedCountry.name);
    this.getSaifi(this.selectedYear, selectedCountry.id)
  }
  
  getSaifi(year:string, product:any) {
    this.nonCollapsableService.getSaifiSum(year,product).subscribe(
      {
        next: (response) => {
          this.isDataPresent = response
          this.xData = response.map((item: { monthly: any; }) => item.monthly);
          this.yData = response.map((item: { total_saifi: any; }) => item.total_saifi);
          console.log("testing data", this.isDataPresent.length)
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          this.chartOption = {
            title: {
              text: 'Basic Bar Chart with Labels',
              left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow' // Shows a shadow line for the bar
            }
        },
            xAxis: {
              type: 'category',
              data: this.xData,
              name: 'Month',             // Label for x-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameTextStyle: {
              fontWeight: 'bold',
              padding: 20             // Padding to adjust distance from the axis
        }
            },
            yAxis: {
              type: 'value',
              name: 'Saifi',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                name: 'Saifi',
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
                color: '#5470C6', // Customize bar color
                borderRadius: [4, 4, 0, 0] // Rounded top corners for bars
            }
              }
            ]
          };
        }
      }
    )
  }

  displayFn(value: any): string {
    return value && value.name ? value.name : '';
  }

    //NG-FOR TRACKBY
    trackByFn(index: number, item: any): any {
      return item.id || index;
  }
}