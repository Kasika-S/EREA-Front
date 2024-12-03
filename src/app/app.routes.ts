import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { IndexComponent } from './modules/user-side/pages/index/index.component';
import { PortfolioComponent } from './modules/user-side/pages/portfolio/portfolio.component';
import { ServicesComponent } from './modules/user-side/pages/services/services.component';
import { TeamComponent } from './modules/user-side/pages/team/team.component';
import { AboutUsComponent } from './modules/user-side/pages/about-us/about-us.component';
import { BuildwithusComponent } from './modules/user-side/pages/buildwithus/buildwithus.component';
import { CeoMessageComponent } from './modules/user-side/pages/ceo-message/ceo-message.component';
import { MissionVisionComponent } from './modules/user-side/pages/mission-vision/mission-vision.component';
import { CorporateStoryComponent } from './modules/user-side/pages/corporate-story/corporate-story.component';
import { ContactUsComponent } from './modules/user-side/pages/contact-us/contact-us.component';
import { PartnersComponent } from './modules/user-side/pages/partners/partners.component';
import { MajorServiceComponent } from './modules/user-side/pages/major-service/major-service.component';
import { OtherServiceComponent } from './modules/user-side/pages/other-service/other-service.component';
import { OurProjectComponent } from './modules/user-side/pages/our-project/our-project.component';
import { ServiceDetailsComponent } from './modules/user-side/pages/service-details/service-details.component';
import { NewsComponent } from './modules/user-side/pages/news/news.component';
import { HomeComponent } from './modules/user-side/home/home.component';
import { PetroleumChartComponent } from './modules/user-side/pages/charts/petroleum/petroleum.component';
import { UserTariffsChartComponent } from './modules/user-side/pages/charts/user-tariffs/user-tariffs.component';
import { GenerationMixChartComponent } from './modules/user-side/pages/charts/generation-mix/generation-mix.component';
import { SaidiChartComponent } from './modules/user-side/pages/charts/saidi/saidi.component';
import { SaifiChartComponent } from './modules/user-side/pages/charts/saifi/saifi.component';
import { ElectricityChartComponent } from './modules/user-side/pages/charts/electricity/electricity.component';

export const routes: Routes = [
      {
            path: "admin",
            component: LayoutComponent,
            children: [
                  {
                        path: '', children: [
                              { path: 'petroleum', loadChildren: () => import('../app/modules/petroleum/petroleum.routes') },
                              { path: 'electricity', loadChildren: () => import('./modules/electricity/electricity.routes') },
                              { path: 'user-tariff', loadChildren: () => import('../app/modules/user-tariff/user-tariff.routes') },
                              { path: 'saidi', loadChildren: () => import('./modules/saidi/saidi.routes') },
                              { path: 'saifi', loadChildren: () => import('./modules/saifi/saifi.routes') },

                              { path: 'connected-customers', loadChildren: () => import('../app/modules/connected-customers/connected-customers.routes') },
                              { path: 'consumption-per-capital', loadChildren: () => import('./modules/consumption-per-capital/consumption-per-capital.routes') },
                              { path: 'effective-capacity', loadChildren: () => import('./modules/effective-capacity/effective-capacity.routes') },

                              { path: 'generation-mix', loadChildren: () => import('./modules/generation-mix/generation-mix.routes') },
                              { path: 'grid-connectivity', loadChildren: () => import('./modules/grid-connectivity/grid-connectivity.routes') },
                              { path: 'installed-capacity', loadChildren: () => import('./modules/installed-capacity/installed-capacity.routes') },
                              { path: 'maximum-demand', loadChildren: () => import('./modules/maximum-demand/maximum-demand.routes') },
                              { path: 'system-load-factor', loadChildren: () => import('./modules/system-load-factor/system-load-factor.routes') },
                        ]
                  },
            ]
      },

      {
            path: "",
            component: HomeComponent,
            children: [
                  {
                        path: '', children: [
                              { path: '', component: IndexComponent, title: 'Home' },
                              { path: 'portfolio', component: PortfolioComponent, title: 'Portfolio' },
                              { path: 'services', component: ServicesComponent, title: 'Services' },
                              { path: 'team', component: TeamComponent, title: 'Team' },
                              { path: 'about-us', component: AboutUsComponent, title: 'About Us' },
                              { path: 'buildwithus', component: BuildwithusComponent, title: 'Build with us' },
                              { path: 'ceo-message', component: CeoMessageComponent, title: 'Policy And Law' },
                              { path: 'mission-vision', component: MissionVisionComponent, title: 'Mission, Vision And Core Values' },
                              { path: 'corporate-story', component: CorporateStoryComponent, title: 'Our Corporate Story' },
                              { path: 'contact-us', component: ContactUsComponent, title: 'Contact Us' },
                              { path: 'our-partners', component: PartnersComponent, title: 'Our Partners' },
                              { path: 'major-service', component: MajorServiceComponent, title: 'Major Service' },
                              { path: 'other-service', component: OtherServiceComponent, title: 'Major Service' },
                              { path: 'project', component: OurProjectComponent, title: 'Our Project' },
                              { path: 'service-details', component: ServiceDetailsComponent, title: 'Service Detail' },
                              { path: 'news', component: NewsComponent, title: 'News' },
                              { path: 'chart/petroleum', component: PetroleumChartComponent, title: 'Petroleum Chart' },
                              { path: 'chart/electricity', component: ElectricityChartComponent, title: 'Electricity Chart' },
                              { path: 'chart/user-tariff', component: UserTariffsChartComponent, title: 'User Tariffs Chart' },
                              { path: 'chart/generation-mix', component: GenerationMixChartComponent, title: 'User Tariffs Chart' },
                              { path: 'chart/saidi', component: SaidiChartComponent, title: 'User Tariffs Chart' },
                              { path: 'chart/saifi', component: SaifiChartComponent, title: 'User Tariffs Chart' },
                        ]
                  },
            ]
      },

];
