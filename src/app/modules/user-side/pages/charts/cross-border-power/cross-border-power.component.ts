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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NonCollapsableService } from '../../../../../core/services/non-collapsable.service';


interface Year {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'chart-cross-border-power',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective,
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
  templateUrl: './cross-border-power.component.html',
  styleUrl: './cross-border-power.component.scss',
  providers: [
    provideEcharts(),
  ]
})


export class CrossBorderPowerChartComponent implements OnInit{
  selectedYear: string = new Date().getFullYear().toString();
  selectedCountry: string;


  country = new FormControl();
  countryList: any[] = [];

  selectedValues: number[] = [];

  chartOption: EChartsOption;
  chartCrossBoderPowerExchangeTariff: EChartsOption;

  xCrossBorderTariff:any;
  yCrossBorderTariff:any;

  xData:any;
  yData:any;
  isDataPresent:any;

  petroleumProduct: any[] = [];

  //PAGINATION
  totalItems: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;

  searchCountry: string = '';

  constructor(private nonCollapsableService: NonCollapsableService, private petroleumService: PetroleumService){}

  ngOnInit(): void {
    this.getCountry()
    this.getCrossBorderTariffs("")
  }

  year: Year[] = [
    {value: '2025', viewValue: '2025'},
    {value: '2024', viewValue: '2024'},
    {value: '2023', viewValue: '2023'},
    {value: '2022', viewValue: '2022'},
  ];

  // onYearChange(event: MatSelectChange) {
  //   console.log('Year selected:', event.value)
  //   this.getCountry()
  //   this.getCrossBorderTariffs(event.value, "")
  // }

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
  
  onCountryClicked1(event: any, country: any): void {
    const index = this.selectedValues.indexOf(country.id);

    if (index === -1) {
      // Add value if not already selected
      this.selectedValues.push(country.id);
    } else {
      // Remove value if already selected
      this.selectedValues.splice(index, 1);
    }

    console.log('Selected Values:', this.selectedValues);


    // this.getCrossBorderTariffs(this.selectedValues)


    // Update FormControl value
    // this.country.setValue(this.selectedValues);
  }

  onCountryClicked2(event: any, country: any): void {
    const index = this.selectedValues.indexOf(country.id);

    if (index === -1) {
      // Add value if not already selected
      this.selectedValues.push(country.id);
    } else {
      // Remove value if already selected
      this.selectedValues.splice(index, 1);
    }

    console.log('Selected Values:', this.selectedValues);


    this.getCrossBorderTariffs(this.selectedValues)


    // Update FormControl value
    // this.country.setValue(this.selectedValues);
  }
  
  getCrossBorderTariffs(country:any) {
    this.nonCollapsableService.getCrossBorderTariffSum(country).subscribe(
      {
        next: (response) => {
          this.isDataPresent = response
          this.xCrossBorderTariff = response.map((item: { yearly: any; }) => item.yearly);
          this.yCrossBorderTariff = response.map((item: { total_tariff_usd_per_mwh: any; }) => item.total_tariff_usd_per_mwh);
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          this.chartCrossBoderPowerExchangeTariff = {
            title: {
              text: 'Cross-Boder Powe Exchange Tariff',
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
              data: this.xCrossBorderTariff,
              name: 'Years',             // Label for x-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameTextStyle: {
              fontWeight: 'bold',
              padding: 20             // Padding to adjust distance from the axis
        }
            },
            yAxis: {
              type: 'value',
              name: 'Tariff (usd per mwh)',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                name: 'Tariff (usd per mwh)',
                data: this.yCrossBorderTariff,
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

  displayFn(value: any): string {
    return value && value.name ? value.name : '';
  }

    //NG-FOR TRACKBY
    trackByFn(index: number, item: any): any {
      return item.id || index;
  }
}