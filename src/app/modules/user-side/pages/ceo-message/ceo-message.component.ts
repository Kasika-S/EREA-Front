import { Component } from '@angular/core';

@Component({
  selector: 'app-ceo-message',
  standalone: true,
  imports: [],
  templateUrl: './ceo-message.component.html',
  styleUrl: './ceo-message.component.css'
})
export class CeoMessageComponent {
  readonly collections = [
    { number: '01', type: 'Tariff framework', title: 'Electricity Feed-in Tariff Policies', documents: [
      { title: 'Feed-In Tariff Uganda', path: 'Electricity Feed-In Tarriff Policies/Feed-In-Tariff-Uganda.pdf' },
      { title: 'Feed-In Tariff Kenya', path: 'Electricity Feed-In Tarriff Policies/Feed-In-Tariff-Kenya.pdf' },
      { title: 'Feed-In Tariff Rwanda', path: 'Electricity Feed-In Tarriff Policies/Feed-In-Tariff-Rwanda.pdf' },
      { title: 'Feed-In Tariff Tanzania', path: 'Electricity Feed-In Tarriff Policies/Feed-In-Tariff-Tanzania.pdf' },
    ] },
    { number: '02', type: 'National policy', title: 'EAC Energy Policies', documents: [
      { title: 'Burundi Energy Policy', path: 'EAC Energy Policies/Burundi Energy Policy.pdf' },
      { title: 'Kenya Energy Policy', path: 'EAC Energy Policies/Kenya Energy Policy.pdf' },
      { title: 'Rwanda Energy Policy', path: 'EAC Energy Policies/Rwanda Energy Policy.pdf' },
      { title: 'Tanzania Energy Policy', path: 'EAC Energy Policies/Tanzania Energy Policy.pdf' },
      { title: 'Uganda Energy Policy', path: 'EAC Energy Policies/Uganda Energy Policy.pdf' },
    ] },
    { number: '03', type: 'Sector legislation', title: 'EAC Petroleum Laws', documents: [
      { title: 'Kenya Petroleum Act 2019', path: 'EAC Petroleum Laws/Kenya Petroleum Act 2019.pdf' },
      { title: 'Rwanda Petroleum Act 2013', path: 'EAC Petroleum Laws/Rwanda Petroleum Act 2013.pdf' },
      { title: 'South Sudan Petroleum Act 2012', path: 'EAC Petroleum Laws/South Sudan Petroleum Act 2012.pdf' },
      { title: 'Tanzania Petroleum Act 2015', path: 'EAC Petroleum Laws/Tanzania Petroleum Act 2015.pdf' },
      { title: 'Uganda Petroleum Act 2013', path: 'EAC Petroleum Laws/Uganda Petroleum Act 2013.pdf' },
    ] },
    { number: '04', type: 'Sector legislation', title: 'Electricity Laws', documents: [
      { title: 'Kenya Energy Act 2019', path: 'Electricity Laws/Energy Act 2019 Kenya.pdf' },
      { title: 'Rwanda Electricity Act 2011', path: 'Electricity Laws/Rwanda Electricity Act 2011.pdf' },
      { title: 'Rwanda Electricity Act Amendments 2018', path: 'Electricity Laws/Rwanda Electricity Act - Ammendments 2018.pdf' },
      { title: 'South Sudan Electricity Bill 2015', path: 'Electricity Laws/South Sudan Electricity Bill 2015.pdf' },
      { title: 'Tanzania Electricity Act 2016', path: 'Electricity Laws/Tanzania Electricity Act 2016.pdf' },
      { title: 'Tanzania Electricity Act Amendments 2020', path: 'Electricity Laws/Tanzania Electricity Act - Ammendments 2020.pdf' },
      { title: 'Uganda Electricity Act 1999', path: 'Electricity Laws/Uganda Electricity Act 1999.pdf' },
    ] },
  ];

  getPdfUrl(path: string): string {
    return `assets/pdf/${encodeURI(path)}`;
  }
}
