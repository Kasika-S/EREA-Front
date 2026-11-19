import { Component } from '@angular/core';
import { PARTNER_DIRECTORY, PartnerDirectoryEntry } from '../../../../core/data/partner-directory';

type PartnerCategory = PartnerDirectoryEntry['category'] | 'All';

@Component({
  selector: 'app-partners',
  standalone: true,
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.css',
})
export class PartnersComponent {
  readonly categories: PartnerCategory[] = ['All', 'Regulator', 'Energy ministry', 'Electricity', 'Petroleum'];
  selectedCategory: PartnerCategory = 'All';
  readonly partners = PARTNER_DIRECTORY;

  get visiblePartners(): PartnerDirectoryEntry[] {
    return this.selectedCategory === 'All' ? this.partners : this.partners.filter((partner) => partner.category === this.selectedCategory);
  }
}
