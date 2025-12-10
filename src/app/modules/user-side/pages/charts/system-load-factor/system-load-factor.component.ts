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
  selector: 'chart-system-load-factor',
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
  templateUrl: './system-load-factor.component.html',
  styleUrl: './system-load-factor.component.scss',
  providers: [
    provideEcharts(),
  ]
})


export class SystemLoadFactorChartComponent implements OnInit{
  selectedYear: string = "2025";
  selectedCountry: string;


  country = new FormControl();
  countryList: any[] = [];

  selectedValues: number[] = [];

  chartOption: EChartsOption;
  chartSystemLoadFactor: EChartsOption;

  xData:any;
  yData:any;
  isDataPresent:any;

  xSystemLoadFactor:any;
  ySystemLoadFactor:any;

  petroleumProduct: any[] = [];

  //PAGINATION
  totalItems: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;

  searchCountry: string = '';

  constructor(private nonCollapsableService: NonCollapsableService, private petroleumService: PetroleumService){}

  ngOnInit(): void {
    this.getCountry()
    this.getSystemLoadFactor("")
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
  //   this.getSystemLoadFactor("")
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


    this.getSystemLoadFactor(this.selectedValues)


    // Update FormControl value
    this.country.setValue(this.selectedValues);
  }
  
  // getSystemLoadFactor(country:any) {
  //   this.nonCollapsableService.getSystemLoadFactorSum(country).subscribe(
  //     {
  //       next: (response) => {

  //       this.xSystemLoadFactor = response.map((item: { yearly: any; }) => item.yearly);
  //       this.ySystemLoadFactor = response.map((item: { total_load_factor_percentage: any; }) => item.total_load_factor_percentage);
  //       },
  //       error: (error) => {
  //         console.log(error.message)
  //       },
  //       complete: () => {

  //         this.chartSystemLoadFactor = {
  //           title: {
  //             text: 'System Load Factor',
  //             left: 'center'

  //           },
  //           tooltip: {
  //             trigger: 'axis'
  //           },
  //           xAxis: {
  //             type: 'category',
  //             data: this.xSystemLoadFactor,
  //             name: 'Years',             // Label for x-axis
  //             nameLocation: 'middle',    // Position the label in the middle
  //             nameTextStyle: {
  //                 fontWeight: 'bold',
  //                 padding: 30             // Padding to adjust distance from the axis
  //             }
  //           },
  //           yAxis: {
  //             type: 'value',
  //             name: 'Load factor percentage',    // Label for y-axis
  //             nameLocation: 'middle',    // Position the label in the middle
  //             nameRotate: 90,            // Rotate the label for vertical alignment
  //             nameTextStyle: {
  //                 fontWeight: 'bold',
  //                 padding: 30             // Padding to adjust distance from the axis
  //             }
  //           },
  //           series: [
  //             {
  //               data: this.ySystemLoadFactor,
  //               type: 'line',
  //               lineStyle: {
  //                 color: '#FFAA1D', // Set the line color
  //                 width: 3,     // Set the line width
  //               },
  //               emphasis: {
  //                 focus: 'series'
  //               },
  //               label: {
  //                 show: true,
  //                 position: 'top', // Position the label above the line
  //                 color: 'black',  // Label color
  //                 fontSize: 12      // Font size for the label
  //             },
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   )
  // }

  seriesSystemLoadFactor:any;

  getSystemLoadFactor(countyIds: any) {
  this.nonCollapsableService.getSystemLoadFactorSum(countyIds).subscribe({
    next: (response) => {
      // Group data by county (if backend sends county info)
      const grouped: any = {};

      response.forEach((item: any) => {
        const county = item.country_name || "All Counties";
        if (!grouped[county]) grouped[county] = [];

        grouped[county].push({
          year: item.yearly,
          value: item.total_load_factor_percentage
        });
      });

      // Extract x-axis years from the first group
      const firstCounty = Object.keys(grouped)[0];
      this.xSystemLoadFactor = grouped[firstCounty].map((d: any) => d.year);

      // Generate all line series
      this.seriesSystemLoadFactor = Object.keys(grouped).map((county, index) => ({
        name: county,
        type: 'line',
        data: grouped[county].map((d: any) => d.value),
        smooth: true,
        lineStyle: {
          width: 3
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 12
        }
      }));
    },

    error: (error) => console.log(error.message),

    complete: () => {
      this.chartSystemLoadFactor = {
        title: {
          text: 'System Load Factor',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: '8%'
        },
        xAxis: {
          type: 'category',
          data: this.xSystemLoadFactor,
          name: 'Years',
          nameLocation: 'middle',
          nameTextStyle: { fontWeight: 'bold', padding: 30 }
        },
        yAxis: {
          type: 'value',
          name: 'Load Factor (%)',
          nameLocation: 'middle',
          nameRotate: 90,
          nameTextStyle: { fontWeight: 'bold', padding: 30 }
        },
        series: this.seriesSystemLoadFactor
      };
    }
  });
}


  displayFn(value: any): string {
    return value && value.name ? value.name : '';
  }

    //NG-FOR TRACKBY
    trackByFn(index: number, item: any): any {
      return item.id || index;
  }
}