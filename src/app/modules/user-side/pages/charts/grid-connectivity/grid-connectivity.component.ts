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
  selector: 'chart-grid-connectivity',
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
  templateUrl: './grid-connectivity.component.html',
  styleUrl: './grid-connectivity.component.scss',
  providers: [
    provideEcharts(),
  ]
})

export class GridConnectivityChartComponent implements OnInit{
  selectedYear: string = "2024";
  selectedCountry: string;


  country = new FormControl();
  countryList: any[] = [];

  selectedValues: number[] = [];

  chartOption: EChartsOption;
  chartGridConnectivity: EChartsOption;

  xGridConnectivity:any;
  yGridConnectivity:any;

  xData:any;
  yData:any;
  isDataPresent: any[] = [];

  petroleumProduct: any[] = [];

  //PAGINATION
  totalItems: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;

  searchCountry: string = '';

  constructor(private nonCollapsableService: NonCollapsableService, private petroleumService: PetroleumService){}

  ngOnInit(): void {
    this.getCountry()
    this.getGridConnectivity("")
  }

  year: Year[] = [
    {value: '2026', viewValue: '2026'},
    {value: '2025', viewValue: '2025'},
    {value: '2024', viewValue: '2024'},
    {value: '2023', viewValue: '2023'},
    {value: '2022', viewValue: '2022'},
  ];

  // onYearChange(event: MatSelectChange) {
  //   console.log('Year selected:', event.value)
  //   this.getCountry()
  //   this.getSaidi(event.value, "")
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


    this.getGridConnectivity(this.selectedValues)


    // Update FormControl value
    this.country.setValue(this.selectedValues);
  }
  
  // getGridConnectivity(country:any) {
  //   this.nonCollapsableService.getGridConnectivitySum(country).subscribe(
  //     {
  //       next: (response) => {

  //       this.xGridConnectivity = response.map((item: { yearly: any; }) => item.yearly);
  //       this.yGridConnectivity = response.map((item: { total_connectivity_percentage: any; }) => item.total_connectivity_percentage);
  //       },
  //       error: (error) => {
  //         console.log(error.message)
  //       },
  //       complete: () => {

  //         this.chartGridConnectivity = {
  //           title: {
  //             text: 'Grid Connectivity',
  //             left: 'center'

  //           },
  //           tooltip: {
  //             trigger: 'axis'
  //           },
  //           xAxis: {
  //             type: 'category',
  //             data: this.xGridConnectivity,
  //             name: 'Years',             // Label for x-axis
  //             nameLocation: 'middle',    // Position the label in the middle
  //             nameTextStyle: {
  //                 fontWeight: 'bold',
  //                 padding: 30             // Padding to adjust distance from the axis
  //             }
  //           },
  //           yAxis: {
  //             type: 'value',
  //             name: 'Grid Connectivity',    // Label for y-axis
  //             nameLocation: 'middle',    // Position the label in the middle
  //             nameRotate: 90,            // Rotate the label for vertical alignment
  //             nameTextStyle: {
  //                 fontWeight: 'bold',
  //                 padding: 30             // Padding to adjust distance from the axis
  //             }
  //           },
  //           series: [
  //             {
  //               data: this.yGridConnectivity,
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

  getGridConnectivity(country: any) {
  this.nonCollapsableService.getGridConnectivitySum(country).subscribe({
    next: (response) => {
      console.log("Grid Connectivity API:", response);

      const reportingYear = Number(this.selectedYear);
      const snapshot = response
        .map((item: any) => ({
          country: item.country,
          value: item.values.find((value: any) => value.year === reportingYear)?.value,
        }))
        .filter((item: any) => item.value !== undefined)
        .sort((a: any, b: any) => a.value - b.value);

      this.chartGridConnectivity = {
        title: {
          text: 'Grid Connectivity',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        xAxis: {
          type: 'value',
          name: 'Connectivity (%)',
          max: 100
        },
        yAxis: {
          type: 'category',
          data: snapshot.map((item: any) => item.country),
        },
        series: [{
          name: `${reportingYear} connectivity`,
          type: 'bar',
          data: snapshot.map((item: any) => item.value),
          itemStyle: { color: '#d99027', borderRadius: [0, 6, 6, 0] },
          label: { show: true, position: 'right', formatter: '{c}%' },
        }]
      };
    },
    error: (error) => {
      console.log(error.message);
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
