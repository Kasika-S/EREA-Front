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

interface Year {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-petroleum',
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
  templateUrl: './petroleum.component.html',
  styleUrl: './petroleum.component.scss',
  providers: [
    provideEcharts(),
  ]
})
export class PetroleumChartComponent implements OnInit{
  selectedYear: string = "2024";
  selectedProduct: string;

  chartOption: EChartsOption;
  chartOption2: EChartsOption;
  xData:any;
  yData:any;
  isDataPresent:any;

  petroleumProduct: any[] = [];

  //PAGINATION
  totalItems: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;

  searchPetroleumProduct: string = '';

  year: Year[] = [
    {value: '2024', viewValue: '2024'},
    {value: '2023', viewValue: '2023'},
    {value: '2022', viewValue: '2022'},
  ];

  constructor(private petroleumService: PetroleumService){}

  ngOnInit(): void {
    this.getPetroleumPrice(this.selectedYear,"")
    this.getVolumeImport(this.selectedYear,"")
  }

  onYearChange(event: MatSelectChange) {
    console.log('Year selected:', event.value)
    this.getPetroleumPrice(event.value, "")
    this.getVolumeImport(event.value,"")
  }

  onProductSelected(event: MatAutocompleteSelectedEvent) {
    const selectedProduct = event.option.value;
    console.log('Selected product:', selectedProduct);
    console.log('Selected product 2:', selectedProduct.name);
    this.getPetroleumPrice(this.selectedYear, selectedProduct.id)
  }
  
  getPetroleumPrice(year:string, product:any) {
    this.petroleumService.getPetroleumMontlyPriceSum(year,product).subscribe(
      {
        next: (response) => {
          this.isDataPresent = response
          this.xData = response.map((item: { monthly: any; }) => item.monthly);
          this.yData = response.map((item: { total_price: any; }) => item.total_price);
          console.log("testing data", this.isDataPresent.length)
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          this.chartOption = {
            title: {
              text: 'Petroleum Price',
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
              name: 'Price (in USD)',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                name: 'Petroleum Price',
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

  getVolumeImport(year:string, product:any) {
    this.petroleumService.getImportVolumeSum(year,product).subscribe(
      {
        next: (response) => {
          this.isDataPresent = response
          this.xData = response.map((item: { petroleum_product: any; }) => item.petroleum_product);
          this.yData = response.map((item: { total_volume: any; }) => item.total_volume);
          console.log("testing data", this.isDataPresent.length)
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          this.chartOption2 = {
            title: {
              text: 'Volume of Import',
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
              name: 'Petroleum',             // Label for x-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameTextStyle: {
              fontWeight: 'bold',
              padding: 20             // Padding to adjust distance from the axis
        }
            },
            yAxis: {
              type: 'value',
              name: 'Volume',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                name: 'Volume',
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

  getPetroleumProducts(event: Event) {
    if(true){
      this.pageNumber = 1
      this.searchPetroleumProduct = (event.target as HTMLInputElement).value
    }
    this.petroleumService.getPetroleumProducts(this.pageNumber, this.pageSize,this.searchPetroleumProduct).subscribe(
      {
        next: (response) => {
          this.petroleumProduct = response.results
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

  displayFn(value: any): string {
    return value && value.name ? value.name : '';
  }

    //NG-FOR TRACKBY
    trackByFn(index: number, item: any): any {
      return item.id || index;
    }
}
