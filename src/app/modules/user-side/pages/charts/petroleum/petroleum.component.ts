import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

import { PetroleumService } from '../../../../../core/services/petroleum.service';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NonCollapsableService } from '../../../../../core/services/non-collapsable.service';

interface Year {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-petroleum',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxEchartsDirective,
      FormsModule,
      ReactiveFormsModule,
      MatIconModule,
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

  country = new FormControl();
  countryList: any[] = [];

  selectedValues: number[] = [];

  selectedYear: string = "2026";
  selectedProduct: string;

  chartOption: EChartsOption;
  chartOption2: EChartsOption;
  xData:any;
  yData:any;
  isDataPresent: any[] = [];

  petroleumProduct: any[] = [];

  //PAGINATION
  totalItems: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;

  searchPetroleumProduct: string = '';

  year: Year[] = [
    {value: '2026', viewValue: '2026'},
    {value: '2025', viewValue: '2025'},
    {value: '2024', viewValue: '2024'},
    {value: '2023', viewValue: '2023'},
    {value: '2022', viewValue: '2022'},
  ];

  labelOption: any = {
    show: true,
    position: 'insideBottom',
    distance: 15,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
      name: {}
    }
  };

  constructor(private petroleumService: PetroleumService, private nonCollapsableService: NonCollapsableService){}

  ngOnInit(): void {
    this.petroleumService.getMonthlyPetroleumPrices(this.selectedYear,"").subscribe((data: any) => {
      this.renderChart(data);
    });
    this.getVolumeImport(this.selectedYear,"")
    this.getCountry()
  }

  getCountry() {
    this.nonCollapsableService.getCountry(1, 10,"").subscribe(
      {
        next: (response) => {
          this.countryList = response.results
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

  onYearChange(event: MatSelectChange) {
    console.log('Year selected:', event.value)
    // this.getPetroleumPrice(event.value, "")
    this.petroleumService.getMonthlyPetroleumPrices(event.value,this.selectedValues).subscribe((data: any) => {
      this.renderChart(data);
    });
    this.getVolumeImport(event.value,"")
  }

  onProductSelected(event: MatAutocompleteSelectedEvent) {
    const selectedProduct = event.option.value;
    console.log('Selected product:', selectedProduct);
    console.log('Selected product 2:', selectedProduct.name);
    // this.getPetroleumPrice(this.selectedYear, selectedProduct.id)
  }

  renderChart(data: any): void {
    const months = data.map((item: any) => item.month);
    const products: string[] = Array.from(new Set(data.flatMap((item: any) => item.products.map((c: any) => c.product))));

    const preferredProducts = products.filter((product: string) => ['Diesel', 'Petrol'].includes(product));
    const visibleProducts = preferredProducts.length > 0 ? preferredProducts : products;
    const series: any = visibleProducts.map((product: string) => {
      return {
        name: product,
        type: 'bar',
        emphasis: {
          focus: 'series',
        },
        label: this.labelOption,
        itemStyle: {
          color: product === 'Diesel' ? '#264a7d' : product === 'Petrol' ? '#FFAB5B' : undefined,
        },
        data: data.map((item: any) => {
          const productData = item.products.find((c: any) => c.product === product);
          return productData ? productData.price : 0;
        }),
      };
    });

    this.chartOption = {
      // title: {
      //   text: 'Price Progression of Petroleum products(US$/Ltr)',
      //   left: 'center'
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: visibleProducts,
        top: '10%'
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          rotate: 45  // Rotate the labels for better readability
        }
      },
      yAxis: {
        type: 'value',
        name: 'Price (US$/Ltr)',
        nameLocation: 'middle',    // Position the label in the middle
        nameRotate: 90,            // Rotate the label for vertical alignment
        nameTextStyle: {
            fontWeight: 'bold',
            padding: 30             // Padding to adjust distance from the axis
        }
      },
      series: series
    };
  }

  getVolumeImport(year:string, country:any) {
    this.petroleumService.getImportVolumeSum(year,country).subscribe(
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
          //   title: {
          //     text: 'Volume of Import',
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
              name: 'Petroleum Product',             // Label for x-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameTextStyle: {
              fontWeight: 'bold',
              padding: 20             // Padding to adjust distance from the axis
        }
            },
            yAxis: {
              type: 'value',
              name: 'Volume (m³)',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 80             // Padding to adjust distance from the axis
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

  onCountryClicked(event: any, country: any): void {
    const index = this.selectedValues.indexOf(country.id);

    if (index === -1) {
      // Add value if not already selected
      this.selectedValues.push(country.id);
    } else {
      // Remove value if already selected
      this.selectedValues.splice(index, 1);
    }

    console.log('Selected Values:', this.selectedValues);

    this.petroleumService.getMonthlyPetroleumPrices(this.selectedYear,this.selectedValues).subscribe((data: any) => {
      this.renderChart(data);
    });

    this.getVolumeImport(this.selectedYear,this.selectedValues)


    // Update FormControl value
    this.country.setValue(this.selectedValues);
  }

  displayFn(value: any): string {
    return value && value.name ? value.name : '';
  }

    //NG-FOR TRACKBY
    trackByFn(index: number, item: any): any {
      return item.id || index;
    }
}
