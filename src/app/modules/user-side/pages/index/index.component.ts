import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { NonCollapsableService } from '../../../../core/services/non-collapsable.service';
import { PARTNER_DIRECTORY } from '../../../../core/data/partner-directory';
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterLink, NgxEchartsDirective],
  providers: [provideEcharts()],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('partnerRail') partnerRail?: ElementRef<HTMLElement>;
  private partnerAutoScroll?: ReturnType<typeof setInterval>;
  private isPartnerCarouselPaused = false;

  readonly partners = PARTNER_DIRECTORY;
  capacitySnapshot?: EChartsOption;
  capacityReportingYear?: number;
  capacityYears: number[] = [];
  regionalCapacityGw?: string;
  selectedCapacityYear: number | 'all' = 2024;
  renewableSnapshot?: EChartsOption;
  private capacityData?: { countries: string[]; years: number[]; installed_capacity: number[] };

  constructor(private readonly dataService: NonCollapsableService) {}

  ngOnInit(): void {
    this.dataService.getCapacity('').subscribe((data) => {
      this.capacityData = data;
      const dataYears = data.years ?? [];
      const countries = data.countries ?? [];
      const installedCapacity = data.installed_capacity ?? [];
      this.capacityYears = dataYears.filter((year: number) => year <= 2024);
      this.selectedCapacityYear = this.capacityYears.includes(2024) ? 2024 : this.capacityYears[this.capacityYears.length - 1];
      const sourceYearIndex = dataYears.indexOf(this.selectedCapacityYear);
      this.regionalCapacityGw = (countries.reduce((total: number, _: string, countryIndex: number) => total + (installedCapacity[countryIndex * dataYears.length + sourceYearIndex] ?? 0), 0) / 1000).toFixed(1);
      this.updateCapacitySnapshot();
    });
    this.dataService.getGenerationContribSum('2024', '').subscribe((data) => this.renewableSnapshot = {
      color: ['#0e7c78', '#003366', '#d29132', '#5e9f8c', '#a55e3a', '#6a7c39', '#7b5ea7'],
      tooltip: { trigger: 'item', valueFormatter: (value) => `${value} MW` },
      legend: { bottom: 0, type: 'scroll', textStyle: { color: '#33434a' } },
      series: [{
        type: 'pie',
        radius: ['48%', '74%'],
        center: ['50%', '43%'],
        avoidLabelOverlap: true,
        label: { formatter: '{b}\n{d}%', fontSize: 11 },
        labelLine: { length: 10, length2: 8 },
        data: data.map((item: any) => ({ name: item.source, value: item.total_contribution })),
      }],
    });
  }

  onCapacityYearChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedCapacityYear = selectedValue === 'all' ? 'all' : Number(selectedValue);
    this.updateCapacitySnapshot();
  }

  private updateCapacitySnapshot(): void {
    if (!this.capacityData) {
      return;
    }

    const { countries, years, installed_capacity: installedCapacity } = this.capacityData;
    if (this.selectedCapacityYear === 'all') {
      this.capacityReportingYear = undefined;
      this.capacitySnapshot = {
        grid: { left: 56, right: 18, top: 24, bottom: 48 },
        tooltip: { trigger: 'axis', valueFormatter: (value) => `${value} MW` },
        xAxis: { type: 'category', data: this.capacityYears },
        yAxis: { type: 'value', name: 'MW' },
        series: [{
          name: 'Regional installed capacity',
          type: 'line',
          smooth: true,
          symbolSize: 7,
          data: this.capacityYears.map((year) => {
            const yearIndex = years.indexOf(year);
            return countries.reduce((total: number, _: string, countryIndex: number) => total + (installedCapacity[countryIndex * years.length + yearIndex] ?? 0), 0);
          }),
          lineStyle: { color: '#0e7c78', width: 3 },
          itemStyle: { color: '#0e7c78' },
          areaStyle: { color: 'rgba(14, 124, 120, 0.15)' },
        }],
      };
      return;
    }

    const visibleYears = [this.selectedCapacityYear];
    this.capacityReportingYear = this.selectedCapacityYear;
    this.capacitySnapshot = {
      grid: { left: 52, right: 16, top: visibleYears.length > 1 ? 48 : 20, bottom: 70 },
      legend: undefined,
      tooltip: { trigger: 'axis', valueFormatter: (value) => `${value} MW` },
      xAxis: { type: 'category', data: countries, axisLabel: { rotate: 28, interval: 0 } },
      yAxis: { type: 'value', name: 'MW' },
      series: visibleYears.map((year, seriesIndex) => {
        const yearIndex = years.indexOf(year);
        return {
          name: String(year),
          type: 'bar',
          data: countries.map((_: string, countryIndex: number) => installedCapacity[countryIndex * years.length + yearIndex] ?? 0),
          itemStyle: { color: ['#0e7c78', '#003366', '#d29132', '#5e9f8c', '#a55e3a', '#6a7c39', '#7b5ea7'][seriesIndex % 7], borderRadius: [4, 4, 0, 0] },
        };
      }),
    };
  }

  scrollPartners(direction: 1 | -1): void {
    const rail = this.partnerRail?.nativeElement;
    if (!rail) {
      return;
    }

    const maximumScroll = rail.scrollWidth - rail.clientWidth;
    const nextPosition = rail.scrollLeft + direction * 310;
    rail.scrollTo({
      left: direction === 1 && nextPosition >= maximumScroll - 8
        ? 0
        : direction === -1 && nextPosition <= 0
          ? maximumScroll
          : nextPosition,
      behavior: 'smooth',
    });
  }

  setPartnerCarouselPaused(paused: boolean): void {
    this.isPartnerCarouselPaused = paused;
  }

  ngAfterViewInit(): void {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.partnerAutoScroll = setInterval(() => {
        if (!this.isPartnerCarouselPaused) {
          this.scrollPartners(1);
        }
      }, 4500);
    }
  }

  ngOnDestroy(): void {
    if (this.partnerAutoScroll) {
      clearInterval(this.partnerAutoScroll);
    }
  }
}
