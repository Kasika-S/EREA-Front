import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
// import 'echarts-gl';

import { PetroleumService } from '../../../../../core/services/petroleum.service';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NonCollapsableService } from '../../../../../core/services/non-collapsable.service';
import { ElectricityService } from '../../../../../core/services/electricity.service';
import { UserTariffsChartComponent } from '../user-tariffs/user-tariffs.component';
import { GenerationMixChartComponent } from '../generation-mix/generation-mix.component';
import { SaidiChartComponent } from '../saidi/saidi.component';
import { SaifiChartComponent } from '../saifi/saifi.component';
import { SystemLoadFactorChartComponent } from "../system-load-factor/system-load-factor.component";
import { CapacityChartComponent } from "../capacity/capacity.component";
import { CrossBorderPowerChartComponent } from "../cross-border-power/cross-border-power.component";
import { GridConnectivityChartComponent } from "../grid-connectivity/grid-connectivity.component";


interface Year {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-electricity',
  standalone: true,
  imports: [CommonModule, RouterLink, NgxEchartsDirective,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    UserTariffsChartComponent,
    GenerationMixChartComponent,
    SaidiChartComponent,
    SaifiChartComponent,
    SystemLoadFactorChartComponent, CapacityChartComponent, CrossBorderPowerChartComponent, GridConnectivityChartComponent],
  templateUrl: './electricity.component.html',
  styleUrl: './electricity.component.scss',
  providers: [
    provideEcharts(),
  ]
})


export class ElectricityChartComponent implements OnInit{
  selectedYear: string = "2025";
  selectedCountry: string;

  country = new FormControl();
  countryList: any[] = [];

  selectedValues: number[] = [];

  chartOption: EChartsOption;
  chartOption2: EChartsOption;
  chartOption3: EChartsOption;
  chartOption4: EChartsOption;
  chartOption5: EChartsOption;
  chartElectricityAccessRate: EChartsOption;
  chartSystemLoadFactor: EChartsOption;
  chartEnergyContribution: EChartsOption;
  chartCrossBoderPowerExchangeTariff: EChartsOption;
  chartDemandVSSupplyVSBalance: EChartsOption;
  chartCapacity: EChartsOption;
  chartGridConnectivity: EChartsOption;


  xData:any;
  yData:any;
  isDataPresent:any;
  dataPresent:any;

  xRegulatoryIndex:any;
  yRegulatoryIndex:any;

  xGovernanceIndex:any;
  yGovernanceIndex:any;

  xSubstanceIndex:any;
  ySubstanceIndex:any;

  xOutcomeIndex:any;
  yOutcomeIndex:any;

  xSystemLoadFactor:any;
  ySystemLoadFactor:any;

  xAccessRate:any;
  yAccessRate:any;
  accessCountries: string[] = [];

  xCrossBorderTariff:any;
  yCrossBorderTariff:any;

  xGridConnectivity:any;
  yGridConnectivity:any;

  capacityYears:any;
  effectiveCapacity:any;
  installedCapacity:any;
  maximumDemand:any;


  months:any;
  commercialLosses:any;
  technicalLosses:any;

  petroleumProduct: any[] = [];

  //PAGINATION
  totalItems: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;

  searchCountry: string = '';

  constructor(private nonCollapsableService: NonCollapsableService, private electricityService: ElectricityService){}

  ngOnInit(): void {
    this.getCountry()

    this.getElectricityLossChart("")
    this.getElectricityRegulatoryIndex("")
    this.getElectricityGovernanceIndex("")
    this.getElectricitySubstanceIndex("")
    this.getElectricityOutcomeIndex("")
    this.getElectricityAccessRate("")
    this.getCrossBorderTariffs("")
    this.getGridConnectivity("")
    this.getCapacity("")
  
  }

  year: Year[] = [
    {value: '2025', viewValue: '2025'},
    {value: '2024', viewValue: '2024'},
    {value: '2023', viewValue: '2023'},
    {value: '2022', viewValue: '2022'},
  ];

  onYearChange(event: MatSelectChange) {
    console.log('Year selected:', event.value)
    // this.getElectricitySum(event.value, "")
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
  
  getElectricitySum(country:any) {
    this.electricityService.getElectricitySum(country).subscribe(
      {
        next: (data) => {
          const response = Array.isArray(data) ? data : [];
          const technicalLoss = response.find((item: any) => item.type_of_loss === 'technical');
          const commercialLoss = response.find((item: any) => item.type_of_loss === 'commercial');
          const allSeries = [technicalLoss, commercialLoss].filter(Boolean);

          this.months = Array.from(
            new Set(
              allSeries.flatMap((item: any) =>
                Array.isArray(item.data) ? item.data.map((d: any) => d.month) : []
              )
            )
          );

          this.commercialLosses = this.months.map((month: any) =>
            commercialLoss?.data?.find((d: any) => d.month === month)?.loss_percentage || 0
          );

          this.technicalLosses = this.months.map((month: any) =>
            (technicalLoss?.data || [])
              .filter((d: any) => d.month === month)
              .reduce((sum: number, d: any) => sum + d.loss_percentage, 0)
          );

        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {
          this.chartOption = {
            title: {
              text: 'Electricity Loss',
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['Commercial Loss', 'Technical Loss'],
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              // boundaryGap: false,
              data: this.months,
              name: 'Months',    // Label for y-axis
              nameLocation: 'middle',  // Position the label in the middle
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }            
            },
            yAxis: {
              type: 'value',
              name: 'Electricity Loss(%)',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                name: 'Commercial Loss',
                type: 'line',
                stack: 'Total',
                endLabel: {
                  show: true,
                  formatter: '{a}', // Display the series name
                  color: 'blue',
                  fontSize: 14
              },
                label: {
                  show: true,
                  position: 'top', // Position the label above the line
                  color: 'black',  // Label color
                  fontSize: 12      // Font size for the label
              },
              lineStyle: {
                color: 'green', // Custom color for Product C
                width: 3,
              },
              data: this.commercialLosses,
            },
              {
                name: 'Technical Loss',
                type: 'line',
                stack: 'Total',
                endLabel: {
                  show: true,
                  formatter: '{a}',
                  color: 'blue',
                  fontSize: 14
              },
                label: {
                  show: true,
                  position: 'top',
                  color: 'black',
                  fontSize: 12,
              },
              lineStyle: {
                color: '#FFAA1D',
                width: 3,
              },
              data: this.technicalLosses,
            },
            ]
          };

          // this.chartCapacity = {
          //   tooltip: {
          //     trigger: 'axis',
          //     axisPointer: {
          //       type: 'shadow'
          //     }
          //   },
          //   legend: {
          //     data: ['Installed Capacity', 'Maximum Demand', 'Effective Capacity']
          //   },
          //   toolbox: {
          //     show: true,
          //     orient: 'vertical',
          //     left: 'right',
          //     top: 'center',
          //     feature: {
          //       mark: { show: true },
          //       dataView: { show: true, readOnly: false },
          //       magicType: { show: true, type: ['line', 'bar', 'stack'] },
          //       restore: { show: true },
          //       saveAsImage: { show: true }
          //     }
          //   },
          //   xAxis: [
          //     {
          //       type: 'category',
          //       axisTick: { show: false },
          //       data: ['2012', '2013', '2014', '2015', '2016']
          //     }
          //   ],
          //   yAxis: [
          //     {
          //       type: 'value'
          //     }
          //   ],
          //   series: [
          //     {
          //       name: 'Installed Capacity',
          //       type: 'bar',
          //       barGap: 0,
          //       emphasis: {
          //         focus: 'series'
          //       },
          //       data: [320, 332, 301, 334, 390]
          //     },
          //     {
          //       name: 'Maximum Demand',
          //       type: 'bar',
          //       emphasis: {
          //         focus: 'series'
          //       },
          //       data: [220, 182, 191, 234, 290]
          //     },
          //     {
          //       name: 'Effective Capacity',
          //       type: 'bar',
          //       emphasis: {
          //         focus: 'series'
          //       },
          //       data: [150, 232, 201, 154, 190]
          //     },
          //   ]
          // }

          // this.chartDemandVSSupplyVSBalance = {
          //   tooltip: {
          //     trigger: 'axis',
          //     axisPointer: {
          //       type: 'shadow'
          //     }
          //   },
          //   legend: {
          //     data: ['Forest', 'Steppe', 'Desert', 'Wetland']
          //   },
          //   toolbox: {
          //     show: true,
          //     orient: 'vertical',
          //     left: 'right',
          //     top: 'center',
          //     feature: {
          //       mark: { show: true },
          //       dataView: { show: true, readOnly: false },
          //       magicType: { show: true, type: ['line', 'bar', 'stack'] },
          //       restore: { show: true },
          //       saveAsImage: { show: true }
          //     }
          //   },
          //   xAxis: [
          //     {
          //       type: 'category',
          //       axisTick: { show: false },
          //       data: ['2012', '2013', '2014', '2015', '2016']
          //     }
          //   ],
          //   yAxis: [
          //     {
          //       type: 'value'
          //     }
          //   ],
          //   series: [
          //     {
          //       name: 'Forest',
          //       type: 'bar',
          //       barGap: 0,
          //       emphasis: {
          //         focus: 'series'
          //       },
          //       data: [320, 332, 301, 334, 390]
          //     },
          //     {
          //       name: 'Steppe',
          //       type: 'bar',
          //       emphasis: {
          //         focus: 'series'
          //       },
          //       data: [220, 182, 191, 234, 290]
          //     },
          //     {
          //       name: 'Desert',
          //       type: 'bar',
          //       emphasis: {
          //         focus: 'series'
          //       },
          //       data: [150, 232, 201, 154, 190]
          //     },
          //     {
          //       name: 'Wetland',
          //       type: 'bar',
          //       emphasis: {
          //         focus: 'series'
          //       },
          //       data: [98, 77, 101, 99, 40]
          //     }
          //   ]
          // }

        }
      }
    )
  }

  getElectricityLossChart(country: any) {
    this.electricityService.getElectricitySum(country).subscribe({
      next: (response) => {
        const series = Array.isArray(response) ? response : [];
        const years = Array.from(new Set(series.flatMap((item: any) => item.data.map((value: any) => value.year)))).sort();
        const palette: Record<string, string> = { system: '#0e7c78', technical: '#d99027', commercial: '#123047' };
        this.chartOption = {
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          legend: { top: 8 },
          grid: { left: 58, right: 24, top: 52, bottom: 42 },
          xAxis: { type: 'category', data: years, name: 'Reporting year' },
          yAxis: { type: 'value', name: 'Regional loss (%)' },
          series: series.map((item: any) => ({
            name: item.type_of_loss === 'system' ? 'System loss' : `${item.type_of_loss[0].toUpperCase()}${item.type_of_loss.slice(1)} loss`,
            type: 'bar',
            data: years.map((year: number) => item.data.find((value: any) => value.year === year)?.loss_percentage ?? null),
            itemStyle: { color: palette[item.type_of_loss] ?? '#6b7280', borderRadius: [4, 4, 0, 0] },
            label: { show: true, position: 'top', formatter: '{c}%' },
          })),
        };
      },
      error: (error) => console.log(error.message),
    });
  }


  getElectricityRegulatoryIndex(country:any) {
    this.electricityService.getElectricityRegulatorySum(country).subscribe(
      {
        next: (response) => {

        this.xRegulatoryIndex = response.map((item: { yearly: any; }) => item.yearly);
        this.yRegulatoryIndex = response.map((item: { total_regulatory_index: any; }) => item.total_regulatory_index);
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {

          this.chartOption2 = {
            title: {
              text: 'Electricity Regulatory Index',
              left: 'center'

            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: this.xRegulatoryIndex,
              name: 'Years',             // Label for x-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            yAxis: {
              type: 'value',
              name: 'Regulatory Index',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                data: this.yRegulatoryIndex,
                type: 'line',
                lineStyle: {
                  color: 'green', // Set the line color
                  width: 3,     // Set the line width
                },
                emphasis: {
                  focus: 'series'
                },
                label: {
                  show: true,
                  position: 'top', // Position the label above the line
                  color: 'black',  // Label color
                  fontSize: 12      // Font size for the label
              },
              }
            ]
          }
        }
      }
    )
  }

  getElectricityGovernanceIndex(country:any) {
    this.electricityService.getElectricityGovernanceSum(country).subscribe(
      {
        next: (response) => {

        this.xGovernanceIndex = response.map((item: { yearly: any; }) => item.yearly);
        this.yGovernanceIndex = response.map((item: { total_governance_index: any; }) => item.total_governance_index);
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {

          this.chartOption3 = {
            title: {
              text: 'Electricity Governance Index',
              left: 'center'

            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: this.xGovernanceIndex,
              name: 'Years',             // Label for x-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            yAxis: {
              type: 'value',
              name: 'Governance Index',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                data: this.yGovernanceIndex,
                type: 'line',
                lineStyle: {
                  color: 'purple', // Set the line color
                  width: 3,     // Set the line width
                },
                emphasis: {
                  focus: 'series'
                },
                label: {
                  show: true,
                  position: 'top', // Position the label above the line
                  color: 'black',  // Label color
                  fontSize: 12      // Font size for the label
              },
              }
            ]
          }
        }
      }
    )
  }

  getElectricitySubstanceIndex(country:any) {
    this.electricityService.getElectricitySubstanceSum(country).subscribe(
      {
        next: (response) => {

        this.xSubstanceIndex = response.map((item: { yearly: any; }) => item.yearly);
        this.ySubstanceIndex = response.map((item: { total_substance_index: any; }) => item.total_substance_index);
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {

          this.chartOption4 = {
            title: {
              text: 'Electricity Substance Index',
              left: 'center'

            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: this.xSubstanceIndex,
              name: 'Years',             // Label for x-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            yAxis: {
              type: 'value',
              name: 'Substance Index',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                data: this.ySubstanceIndex,
                type: 'line',
                lineStyle: {
                  color: '#FFAA1D', // Set the line color
                  width: 3,     // Set the line width
                },
                emphasis: {
                  focus: 'series'
                },
                label: {
                  show: true,
                  position: 'top', // Position the label above the line
                  color: 'black',  // Label color
                  fontSize: 12      // Font size for the label
              },
              }
            ]
          }
        }
      }
    )
  }

  getElectricityOutcomeIndex(country:any) {
    this.electricityService.getElectricityOutcomeSum(country).subscribe(
      {
        next: (response) => {

        this.xOutcomeIndex = response.map((item: { yearly: any; }) => item.yearly);
        this.yOutcomeIndex = response.map((item: { total_outcome_index: any; }) => item.total_outcome_index);
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {

          this.chartOption5 = {
            title: {
              text: 'Electricity Outcome Index',
              left: 'center'

            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: this.xOutcomeIndex,
              name: 'Years',             // Label for x-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            yAxis: {
              type: 'value',
              name: 'Outcome Index',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                data: this.yOutcomeIndex,
                type: 'line',
                lineStyle: {
                  color: 'red', // Set the line color
                  width: 3,     // Set the line width
                },
                emphasis: {
                  focus: 'series'
                },
                label: {
                  show: true,
                  position: 'top', // Position the label above the line
                  color: 'black',  // Label color
                  fontSize: 12      // Font size for the label
              },
              }
            ]
          }
        }
      }
    )
  }

  legendData:any;
  seriesData:any;

 getElectricityAccessRate(country: any) {
  this.electricityService.getElectricityAccessRateSum(country).subscribe({
    next: (response) => {
      // response format:
      // [
      //   { country: 'Tanzania', values: [{year:2020, value:150}, ...] },
      //   { country: 'Kenya', values: [...] },
      // ]

      const allYears = new Set<number>();
      response.forEach((c: any) => {
        c.values.forEach((v: any) => allYears.add(v.year));
      });

      this.xAccessRate = Array.from(allYears).sort();
      this.accessCountries = response.map((country: any) => country.country);
      this.legendData = this.xAccessRate.map(String);
      const accessRatePalette = [
        '#123047', '#0e7c78', '#d99027', '#bd4f6c',
        '#5a6fb2', '#5b8c42', '#8c5b35', '#6a4c93',
      ];
      this.seriesData = this.xAccessRate.map((year: number, index: number) => ({
        name: String(year),
        type: 'bar',
        data: response.map((country: any) => country.values.find((value: any) => value.year === year)?.value ?? null),
        itemStyle: { color: accessRatePalette[index % accessRatePalette.length], borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', formatter: '{c}%' },
      }));
    },

    error: (error) => {
      console.log(error.message);
    },

    complete: () => {
      // 4️⃣ Build the final chart
      this.chartElectricityAccessRate = {
        title: {
          text: 'Electricity Access Rate',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.legendData,
          left: 'center',
          top: 30
        },
        xAxis: {
          type: 'category',
          data: this.accessCountries,
          name: 'Member state',
          nameLocation: 'middle',
          nameTextStyle: {
            fontWeight: 'bold',
            padding: 30
          }
        },
        yAxis: {
          type: 'value',
          name: 'Access Rate (%)',
          nameLocation: 'middle',
          nameRotate: 90,
          nameTextStyle: {
            fontWeight: 'bold',
            padding: 30
          }
        },
        series: this.seriesData
      };
    }
  });
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
              text: 'Cross-Border Power Exchange Tariff',
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

  getGridConnectivity(country:any) {
    this.nonCollapsableService.getGridConnectivitySum(country).subscribe(
      {
        next: (response) => {

        this.xGridConnectivity = response.map((item: { yearly: any; }) => item.yearly);
        this.yGridConnectivity = response.map((item: { total_connectivity_percentage: any; }) => item.total_connectivity_percentage);
        },
        error: (error) => {
          console.log(error.message)
        },
        complete: () => {

          this.chartGridConnectivity = {
            title: {
              text: 'Grid Connectivity',
              left: 'center'

            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: this.xGridConnectivity,
              name: 'Years',             // Label for x-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            yAxis: {
              type: 'value',
              name: 'Grid Connectivity',    // Label for y-axis
              nameLocation: 'middle',    // Position the label in the middle
              nameRotate: 90,            // Rotate the label for vertical alignment
              nameTextStyle: {
                  fontWeight: 'bold',
                  padding: 30             // Padding to adjust distance from the axis
              }
            },
            series: [
              {
                data: this.yGridConnectivity,
                type: 'line',
                lineStyle: {
                  color: '#FFAA1D', // Set the line color
                  width: 3,     // Set the line width
                },
                emphasis: {
                  focus: 'series'
                },
                label: {
                  show: true,
                  position: 'top', // Position the label above the line
                  color: 'black',  // Label color
                  fontSize: 12      // Font size for the label
              },
              }
            ]
          }
        }
      }
    )
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


    this.getElectricitySum(this.selectedValues)
    this.getElectricityRegulatoryIndex(this.selectedValues)
    this.getElectricityGovernanceIndex(this.selectedValues)
    this.getElectricitySubstanceIndex(this.selectedValues)
    this.getElectricityOutcomeIndex(this.selectedValues)
    this.getElectricityAccessRate(this.selectedValues)


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
