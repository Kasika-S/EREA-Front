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
  selector: 'chart-capacity',
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
],  templateUrl: './capacity.component.html',
  styleUrl: './capacity.component.scss',
  providers: [
    provideEcharts(),
  ]
})


export class CapacityChartComponent implements OnInit{
  selectedYear: string = "2024";
  selectedCountry: string;


  country = new FormControl();
  countryList: any[] = [];

  selectedValues: number[] = [];

  chartOption: EChartsOption;
  chartCapacity: EChartsOption;

  capacityYears:any;
  effectiveCapacity:any;
  installedCapacity:any;
  maximumDemand:any;

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
    this.getCapacity("")
  }

  year: Year[] = [
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


    this.getCapacity(this.selectedValues)


    // Update FormControl value
    this.country.setValue(this.selectedValues);
  }
  
  getCapacity(country:any) {
    this.nonCollapsableService.getCapacity(country).subscribe(
      {
        next: (response) => {
          this.capacityYears = response.years;
          this.effectiveCapacity = response.effective_capacity;
          this.installedCapacity = response.installed_capacity;
          this.maximumDemand = response.maximum_demand;

          console.log("testing capacityYears", this.capacityYears)
          console.log("testing effectiveCapacity", this.effectiveCapacity)
          console.log("testing installedCapacity", this.installedCapacity)
          console.log("testing maximumDemand", this.maximumDemand)

        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          this.chartCapacity = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' }
            },
            legend: {
                data: ['Effective Capacity', 'Installed Capacity', 'Maximum Demand']
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
                axisTick: { show: false },
                data: this.capacityYears
            },
            yAxis: {
                type: 'value',
                name: 'Capacity (MW)'
            },
            series: [
                {
                    name: 'Effective Capacity',
                    type: 'bar',
                    barGap: 0,
                    data: this.effectiveCapacity
                },
                {
                    name: 'Installed Capacity',
                    type: 'bar',
                    data: this.installedCapacity
                },
                {
                    name: 'Maximum Demand',
                    type: 'bar',
                    data: this.maximumDemand
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
