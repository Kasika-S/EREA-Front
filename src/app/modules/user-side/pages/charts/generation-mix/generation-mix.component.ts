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
  selector: 'chart-generation-mix',
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
  templateUrl: './generation-mix.component.html',
  styleUrl: './generation-mix.component.scss',
  providers: [
    provideEcharts(),
  ]
})

export class GenerationMixChartComponent implements OnInit{
  selectedYear: string = "2024";
  selectedCountry: string;

  country = new FormControl();
  countryList: any[] = [];

  selectedValues: number[] = [];

  chartOption: EChartsOption;
  chartEnergyContribution: EChartsOption;

  xData:any;
  yData:any;
  dataPresent:any;

  petroleumProduct: any[] = [];

  //PAGINATION
  totalItems: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;

  searchCountry: string = '';

  constructor(private nonCollapsableService: NonCollapsableService, private petroleumService: PetroleumService){}

  ngOnInit(): void {
    this.getCountry()
    this.getGenerationMix(this.selectedYear,"")
    this.getGenerationContrib(this.selectedYear,"")
    
  }

  year: Year[] = [
    {value: '2024', viewValue: '2024'},
    {value: '2023', viewValue: '2023'},
    {value: '2022', viewValue: '2022'},
  ];

  onYearChange(event: MatSelectChange) {
    console.log('Year selected:', event.value)
    this.getGenerationMix(event.value, "")
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


    this.getGenerationMix(this.selectedYear,this.selectedValues)
    this.getGenerationContrib(this.selectedYear,this.selectedValues)


    // Update FormControl value
    this.country.setValue(this.selectedValues);
  }
  
  getGenerationMix(year:string, country:any) {
    this.nonCollapsableService.getGenerationMixSum(year,country).subscribe(
      {
        next: (response) => {
          this.dataPresent = response.map((item: { electricity_source: any; total_contribution: any; }) => ({
            name: item.electricity_source,
            value: item.total_contribution
        }))

          this.xData = response.map((item: { total_contribution: any; }) => item.total_contribution);
          this.yData = response.map((item: { electricity_source: any; }) => item.electricity_source);
          console.log("testing data", this.dataPresent.length)
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          this.chartOption = {
            title: {
                text: 'Generation Mix',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)' // Shows data in the format: Name : Value (Percentage)
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: this.yData
            },
            series: [
                {
                    name: 'Generation Mix',
                    type: 'pie',
                    radius: '80%', // Adjusts the size of the pie chart
                    data: this.dataPresent,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        show: true,
                        formatter: '{b}: {d}%', // Shows the name and percentage on each slice
                        fontSize: 12,
                        color: '#333'
                    }
                }
            ]
        };
        }
      }
    )
  }

  getGenerationContrib(year:string, country:any) {
    this.nonCollapsableService.getGenerationContribSum(year,country).subscribe(
      {
        next: (response) => {
          this.dataPresent = response.map((item: { source: any; total_contribution: any; }) => ({
            name: item.source,
            value: item.total_contribution
        }))

          this.xData = response.map((item: { total_contribution: any; }) => item.total_contribution);
          this.yData = response.map((item: { source: any; }) => item.source);
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          this.chartEnergyContribution = {
            title: {
                text: 'Energy Contribution',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)' // Shows data in the format: Name : Value (Percentage)
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: this.yData
            },
            series: [
                {
                    name: 'Energy Contribution',
                    type: 'pie',
                    radius: '80%', // Adjusts the size of the pie chart
                    data: this.dataPresent,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        show: true,
                        formatter: '{b}: {d}%', // Shows the name and percentage on each slice
                        fontSize: 12,
                        color: '#333'
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