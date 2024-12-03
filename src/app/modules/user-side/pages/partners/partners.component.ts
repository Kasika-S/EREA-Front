import { NgClass, NgFor, NgIf, } from '@angular/common';
import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import SwiperCore from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';


//swiper
// import { SwiperModule } from 'swiper/types';

// install Swiper modules
SwiperCore.use([Navigation, Autoplay]);

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [NgClass, NgFor, NgIf ],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class PartnersComponent implements OnInit{
  @Input() title: string = '';
  @Input() subTitle: string = '';
  @Input() partners: any[] = [
    {
        id: 1,
        logo: '/assets/images/partners/petroleum/tpdc.jpg',
        country: 'Tanzania',
        organization:'TPDC',
        link:'https://tpdc.co.tz',
    },
    {
      id: 2,
      logo: '/assets/images/partners/petroleum/zpra.png',
      country: 'Tanzania',
      organization:'Zanzibar Petroleum ZPRA',
      link:'https://www.zpra.go.tz/',
   },
  //  {
  //     id: 3,
  //     logo: '/assets/images/partners/petroleum/equinor.png',
  //     country: 'Tanzania',
  //     organization:'EQUINOR',
  //     link:'https://www.equinor.com/where-we-are/tanzania',
  // },
  // {
  //     id: 4,
  //     logo: '/assets/images/partners/petroleum/maurel.png',
  //     country: 'Tanzania',
  //     organization:'MAUREL AND PROM',
  //     link:'https://www.maureletprom.fr/en',
  // },
  // {
  //     id: 5,
  //     logo: '/assets/images/partners/petroleum/panafrica.jpg',
  //     country: 'Tanzania',
  //     organization:'PAET',
  //     link:'https://www.panafricanenergy.com/',
  // },
  {
      id: 6,
      logo: '/assets/images/partners/petroleum/pbpa.png',
      country: 'Tanzania',
      organization:'PBPA',
      link:'https://www.pbpa.go.tz/index.php',
  },
  {
      id: 7,
      logo: '/assets/images/partners/petroleum/eacop.png',
      country: 'Tanzania',
      organization:'EACOP',
      link:'https://www.eacop.com/',
  },

  {
    id: 8,
    logo: '/assets/images/partners/petroleum/kpc.png',
    country: 'Kenya',
    organization:'Kenya Pipeline Company',
    link:'https://www.kpc.co.ke/',
},
{
    id: 9,
    logo: '/assets/images/partners/petroleum/nationaloil.jpg',
    country: 'Kenya',
    organization:'National oil cooperation of Kenya',
    link:'https://nationaloil.co.ke/',
},

{
    id: 10,
    logo: '/assets/images/partners/petroleum/kprl.png',
    country: 'Kenya',
    organization:'Kenya Petroleum Refineries ltd',
    link:'https://www.kprl.co.ke/',
},

{
    id: 11,
    logo: '/assets/images/partners/petroleum/eacop.png',
    country: 'Uganda',
    organization:'EACOP',
    link:'https://www.eacop.com/',
},
{
  id: 12,
  logo: '/assets/images/partners/petroleum/unoc.png',
  country: 'Uganda',
  organization:'Uganda National Oil co.',
  link:'https://www.unoc.co.ug/',
},
{
  id: 13,
  logo: '/assets/images/partners/petroleum/ranto.jpg',
  country: 'Uganda',
  organization:'Oranto Petroleum',
  link:'https://atlasorantoenergy.com/',
},

// {
//   id: 14,
//   logo: '/assets/images/partners/petroleum/totalenergies.png',
//   country: 'Uganda',
//   organization:'Total Energies',
//   link:'https://totalenergies.com/uganda',
// },
  {
    id: 15,
    logo: '/assets/images/partners/petroleum/regrw.png',
    country: 'Rwanda',
    organization:'Rwanda Energy Group',
    link:'https://www.reg.rw/about-us/history/',
  },
  // {
  //   id: 16,
  //   logo: '/assets/images/partners/petroleum/vivo.png',
  //   country: 'Rwanda',
  //   organization:'VIVO ENERGY',
  //   link:'https://www.vivoenergy.com/en/where-we-operate/rwanda',
  // },
  {
    id: 17,
    logo: '/assets/images/partners/petroleum/sopebu.png',
    country: 'Burundi',
    organization:'SOPEBU',
    link:'https://www.sopebuburundi.com/',
  },
  // {
  //   id: 18,
  //   logo: '/assets/images/partners/petroleum/eagle.jpg',
  //   country: 'Burundi',
  //   organization:'Eagle Capital Energy',
  //   link:'https://www.eaglecapitalburundi.com/index.php/eagle-capital-energy',
  // },
  // {
  //   id: 19,
  //   logo: '/assets/images/partners/petroleum/interpol.jpg',
  //   country: 'Burundi',
  //   organization:'Interpetrol Burundi',
  //   link:'http://www.interpetrol.bi/',
  // },
//  {
//     id: 20,
//     logo: '/assets/images/partners/petroleum/hasspetrol.png',
//     country: 'DRC',
//     organization:'Hass petroleum DRC',
//     link:'https://hasspetroleum.com/',
//   },
//   {
//     id: 10,
//     logo: '/assets/images/partners/petroleum/eagle.jpg',
//     country: 'DRC',
//     organization:'Pacific Petroleum DRC Sarl',
//     link:'https://www.pacificpetroleumltd.com/coutry/democratic-republic-of-congo/',
//   },
  {
    id: 21,
    logo: '/assets/images/partners/petroleum/snpc.png',
    country: 'DRC',
    organization:'National Petroleum Company of the Congo',
    link:'https://snpc-group.com',
  },
];

@Input() minEnergy: any[] = [
  {
      id: 1,
      logo: '/assets/images/partners/min_energy/moe.png',
      country: 'Tanzania',
      organization:'Ministry of Energy',
      link:'https://www.nishati.go.tz/',
  },
  
{
  id: 8,
  logo: '/assets/images/partners/min_energy/moep.jpg',
  country: 'Kenya',
  organization:'Ministry of Energy and Petroleum ',
  link:'https://energy.go.ke/',
},
{
  id: 11,
  logo: '/assets/images/partners/min_energy/memd.png',
  country: 'Uganda',
  organization:'MEMD',
  link:'https://memd.go.ug/',
},
{
  id: 15,
  logo: '/assets/images/partners/min_energy/rwanda.png',
  country: 'Rwanda',
  organization:'Ministry of Infrastructure',
  link:'https://www.mininfra.gov.rw/',
},
{
  id: 17,
  logo: '/assets/images/partners/min_energy/mhem.png',
  country: 'Burundi',
  organization:'Ministry of Hydraulics, Energy and Mines',
  link:'https://www.developmentaid.org/donors/view/143507/ministere-de-lhydraulique-de-lenergie-et-des-mines-mhem-burundi',
},
{
  id: 19,
  logo: '/assets/images/partners/min_energy/non-found.png',
  country: 'SOMALIA',
  organization:'Ministry of Petroleum and Mineral Resources',
  link:'https://mopmr.gov.so/',
},
{
  id: 20,
  logo: '/assets/images/partners/min_energy/south.png',
  country: 'SOUTH SUDAN',
  organization:'Ministry of Petroleum and Mining',
  link:'https://mop.gov.ss/',
},
{
  id: 21,
  logo: '/assets/images/partners/min_energy/non-found.png',
  country: 'DRC',
  organization:'The Ministry of Hydraulic Resources and Electricity',
  link:'https://snpc-group.com',
},
];

@Input() electricity: any[] = [
  {
      id: 1,
      logo: '/assets/images/partners/electricity/tanesco.jpg',
      country: 'Tanzania',
      organization:'TANESCO',
      link:'https://www.tanesco.co.tz/',
  },
  {
    id: 2,
    logo: '/assets/images/partners/electricity/zeco.png',
    country: 'Tanzania',
    organization:'ZECO',
    link:'https://zeco.co.tz/',
},
{
  id: 3,
  logo: '/assets/images/partners/electricity/rea.jpg',
  country: 'Tanzania',
  organization:'REA',
  link:'https://rea.go.tz/',
},
  
{
  id: 8,
  logo: '/assets/images/partners/electricity/kplc.png',
  country: 'Kenya',
  organization:'KPLC',
  link:'https://kplc.co.ke/',
},
{
  id: 9,
  logo: '/assets/images/partners/electricity/rerec.jpg',
  country: 'Kenya',
  organization:'REREC',
  link:'www.rerec.co.ke',
},
{
  id: 10,
  logo: '/assets/images/partners/electricity/ketrac.jpg',
  country: 'Kenya',
  organization:'KETRAC',
  link:'https://ketraco.co.ke/',
},
{
  id: 11,
  logo: '/assets/images/partners/electricity/gdc.jpg',
  country: 'Kenya',
  organization:'GDC',
  link:'https://www.gdc.co.ke/',
},
{
  id: 12,
  logo: '/assets/images/partners/electricity/nuclear.png',
  country: 'Kenya',
  organization:'NuPEA',
  link:'https://www.nuclear.co.ke/',
},
{
  id: 13,
  logo: '/assets/images/partners/electricity/kengen.png',
  country: 'Kenya',
  organization:'KenGen',
  link:'https://www.kengen.co.ke/',
},


{
  id: 14,
  logo: '/assets/images/partners/electricity/uedcl.png',
  country: 'Uganda',
  organization:'UEDCL',
  link:'www.uedcl.co.ug',
},
{
  id: 15,
  logo: '/assets/images/partners/electricity/uetcl.png',
  country: 'Uganda',
  organization:'UETCL',
  link:'www.uetcl.go.ug',
},
{
  id: 16,
  logo: '/assets/images/partners/electricity/umeme.png',
  country: 'Uganda',
  organization:'Umeme ltd',
  link:'www.umeme.co.ug',
},
{
  id: 17,
  logo: '/assets/images/partners/electricity/wenreco.png',
  country: 'Uganda',
  organization:'West Nile Rural Electrification ',
  link:'www.wenreco.co.ug',
},
{
  id: 17,
  logo: '/assets/images/partners/electricity/uegcl.png',
  country: 'Uganda',
  organization:'Uganda Electricity Generation company ltd',
  link:'https://www.uegcl.com/',
},

{
  id: 18,
  logo: '/assets/images/partners/electricity/reg.png',
  country: 'Rwanda',
  organization:'Rwanda Electricity Corporation',
  link:'https://www.reg.rw/index.php?id=2',
},

{
  id: 19,
  logo: '/assets/images/partners/electricity/weza.png',
  country: 'Burundi',
  organization:'Weza Power',
  link:'https://www.wezapower.com/',
},

{
  id: 20,
  logo: '/assets/images/partners/electricity/songa.png',
  country: 'Burundi',
  organization:'Songa Energy',
  link:'https://www.songaenergy.com/',
},

{
  id: 21,
  logo: '/assets/images/partners/regulators/nea.png',
  country: 'SOMALIA',
  organization:'NEA',
  link:'https://www.songaenergy.com/',
},
{
  id: 22,
  logo: '/assets/images/partners/electricity/moewr.jpg',
  country: 'SOMALIA',
  organization:'Somalia Electricity Authority',
  link:'https://moewr.gov.so/electricity-authority/',
},

{
  id: 23,
  logo: '/assets/images/partners/electricity/non-found.png',
  country: 'SOUTH SUDAN',
  organization:'South Sudan Electricity Corporation',
  link:' ',
},
{
  id: 24,
  logo: '/assets/images/partners/electricity/jedco.png',
  country: 'SOUTH SUDAN',
  organization:'JEDCO',
  link:'https://www.jedcopower.com/',
},

{
  id: 25,
  logo: '/assets/images/partners/electricity/snel.png',
  country: 'DRC',
  organization:"Société Nationale d'Électricité (SNEL)",
  link:' ',
},
];

@Input() regulators: any[] = [
  {
      id: 1,
      logo: '/assets/images/partners/regulators/ewura.jpg',
      country: 'Tanzania',
      organization:'EWURA',
      link:'https://www.ewura.go.tz/',
  },
  {
    id: 2,
    logo: '/assets/images/partners/regulators/zura.jpg',
    country: 'Tanzania',
    organization:'ZURA',
    link:'https://www.ewura.go.tz/',
},
{
  id: 3,
  logo: '/assets/images/partners/regulators/pura.png',
  country: 'Tanzania',
  organization:'PURA',
  link:'https://www.pura.go.tz/',
},
{
  id: 4,
  logo: '/assets/images/partners/regulators/zpra.png',
  country: 'Tanzania',
  organization:'ZPRA',
  link:'https://www.zpra.go.tz/',
},
  
{
  id: 8,
  logo: '/assets/images/partners/regulators/erea.png',
  country: 'Kenya',
  organization:'EPRA',
  link:'https://energyregulators.org/',
},
{
  id: 11,
  logo: '/assets/images/partners/regulators/era.png',
  country: 'Uganda',
  organization:'ERA',
  link:'https://www.era.go.ug/',
},
{
  id: 11,
  logo: '/assets/images/partners/regulators/pau.png',
  country: 'Uganda',
  organization:'PAU',
  link:'https://www.pau.go.ug/',
},
{
  id: 15,
  logo: '/assets/images/partners/regulators/rura.png',
  country: 'Rwanda',
  organization:'RURA',
  link:'https://www.rura.rw/index.php?id=23&L=0',
},
{
  id: 17,
  logo: '/assets/images/partners/regulators/areen.png',
  country: 'Burundi',
  organization:'AREEN',
  link:'https://www.areen.bi/',
},
{
  id: 19,
  logo: '/assets/images/partners/regulators/nea.png',
  country: 'SOMALIA',
  organization:'NEA',
  link:'https://nea.gov.so/',
},
{
  id: 20,
  logo: '/assets/images/partners/regulators/non-found.png',
  country: 'SOUTH SUDAN',
  organization:'Ministry of Energy and Dams',
  link:'https://mop.gov.ss/',
},
{
  id: 21,
  logo: '/assets/images/partners/regulators/are.png',
  country: 'DRC',
  organization:'ARE',
  link:'https://are.gouv.cd/',
},
];

  @Input() type: string = 'service';

  groupedPartners: { [key: string]: any[] } = {};
  groupedMinEnergyPartners: { [key: string]: any[] } = {};
  groupedElectricityPartners: { [key: string]: any[] } = {};
  groupedRegulatorPartners: { [key: string]: any[] } = {};

  ngOnInit(): void {
    this.groupByCountry();
  }

  groupByCountry(): void {
    this.groupedPartners = this.partners.reduce((result, partner) => {
      (result[partner.country] = result[partner.country] || []).push(partner);
      return result;
    }, {});

    this.groupedMinEnergyPartners = this.minEnergy.reduce((result, partner) => {
      (result[partner.country] = result[partner.country] || []).push(partner);
      return result;
    }, {});

    this.groupedElectricityPartners = this.electricity.reduce((result, partner) => {
      (result[partner.country] = result[partner.country] || []).push(partner);
      return result;
    }, {});

    this.groupedRegulatorPartners = this.regulators.reduce((result, partner) => {
      (result[partner.country] = result[partner.country] || []).push(partner);
      return result;
    }, {});
  }

  getCountries(): string[] {
    return Object.keys(this.groupedPartners);
  }

  getCountriesMinEnergy(): string[] {
    return Object.keys(this.groupedMinEnergyPartners);
  }
  
  config: any = {
      loop: true,
      slidesPerView: 'auto',
      spaceBetween: 30,
      autoplay: {
          delay: 3000,
          disableOnInteraction: false,
      },
      navigation: {
          nextEl: '.blog-slider-button-next',
          prevEl: '.blog-slider-button-prev',
      },
      // modules: [Navigation, Autoplay],
      breakpoints: {
          640: {
              slidesPerView: 2,
          },
          1024: {
              slidesPerView: 3,
          },
      },
  };


  constructor() {}
}