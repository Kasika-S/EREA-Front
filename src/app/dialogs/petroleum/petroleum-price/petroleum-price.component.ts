import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgClass } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';

import { PetroleumService } from '../../../core/services/petroleum.service';
import { NonCollapsableService } from '../../../core/services/non-collapsable.service';


@Component({
  selector: 'app-petroleum-price',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgClass,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSelectModule,
  ], 
  templateUrl: './petroleum-price.component.html',
  styleUrl: './petroleum-price.component.scss'
})


export class PetroleumPriceComponent implements OnInit{

  // FORM NAME
  petroleumForm!: UntypedFormGroup;

  country: any[] = [];
  petroleumProduct: any[] = [];
  administrativeLevel1: any[] = [];

  searchCountry: string = '';
  searchPetroleumProduct: string = '';

  totalItems: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;

  //CONSTRUCTOR
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private dialogRef: MatDialogRef<PetroleumPriceComponent>,
  private route: ActivatedRoute,
  private _formBuilder: UntypedFormBuilder,
  private petroleumService: PetroleumService,
  private nonCollapsableService: NonCollapsableService,
  private router: Router
) { }

ngOnInit(): void {
  this.petroleumForm = this._formBuilder.group({
    country: [null],
    petroleum_product: [null],
    administrative_level1: [null],
    price: [null],
  });
  this.getAdministrativeLevel1();
}

getCountry() {
  this.pageNumber = 1;
  this.searchCountry = this.petroleumForm.get('country')?.value;
  this.nonCollapsableService.getCountry(this.pageNumber, this.pageSize, this.searchCountry).subscribe(
    {
      next: (response) => {
        this.country = response.results;
        this.totalItems = response.count;
        this.pageNumber = response.page_number;
        this.pageSize = response.page_size;
      },
      error: (error) => {
        console.log(error.message);
      },
    }
  );
}

getPetroleumProducts() {
  this.pageNumber = 1;
  this.searchPetroleumProduct = this.petroleumForm.get('petroleum_product')?.value;
  this.petroleumService.getPetroleumProducts(this.pageNumber, this.pageSize, this.searchPetroleumProduct).subscribe(
    {
      next: (response) => {
        this.petroleumProduct = response.results;
        this.totalItems = response.count;
        this.pageNumber = response.page_number;
        this.pageSize = response.page_size;
      },
      error: (error) => {
        console.log(error.message);
      },
    }
  );
}

getAdministrativeLevel1() {
  this.nonCollapsableService.getAdmin1().subscribe(
    {
      next: (response) => {
        this.administrativeLevel1 = response.DATA ?? [];
      },
      error: (error) => {
        console.log(error.message);
      },
    }
  );
}

displayFn(value: any): string {
  return value && value.name ? value.name : '';
}

saveInfo(){
  this.petroleumForm.patchValue({
    country: this.petroleumForm.get('country')?.value?.id,
    petroleum_product: this.petroleumForm.get('petroleum_product')?.value?.id,
    administrative_level1: this.petroleumForm.get('administrative_level1')?.value?.id,
  });
  this.petroleumService.addPetroleumPrice(this.petroleumForm.value).subscribe((response)=> {
    console.log(response)
  },
  (error) => {
    // this.openInformationalPrompt(error.message);
  },
  () => {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentUrl]);
  });
  })
  this.dialogRef.close()
}

trackByFn(index: number, item: any): any {
  return item.id || index;
}
}
