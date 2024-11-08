import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgClass } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NonCollapsableService } from '../../core/services/non-collapsable.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@Component({
  selector: 'app-installed-capacity',
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
    MatAutocompleteModule
  ], 
  templateUrl: './installed-capacity.component.html',
  styleUrl: './installed-capacity.component.scss'
})

export class InstalledDialogCapacityComponent implements OnInit{

  //FORM NAME
  userTariffForm!: UntypedFormGroup;

  country: any[] = [];

  //SEARCHING
   searchCountry: string = '';

  //PAGINATION
   totalItems: number = 0;
   pageSize: number = 10;
   pageNumber: number = 1;

  //CONSTRUCTOR
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private dialogRef: MatDialogRef<InstalledDialogCapacityComponent>,
  private route: ActivatedRoute,
  private _formBuilder: UntypedFormBuilder,
  private nonCollapsableService: NonCollapsableService,
  private router: Router
) { }

ngOnInit(): void {
  this.userTariffForm = this._formBuilder.group({
    country: [null],
    capacity: [null],
  });
}

getCountry() {
  if(true){
    this.pageNumber = 1
    this.searchCountry = this.userTariffForm.get('country')?.value
  }
  this.nonCollapsableService.getCountry(this.pageNumber, this.pageSize,this.searchCountry).subscribe(
    {
      next: (response) => {
        this.country = response.results
        this.totalItems = response.count
        this.pageNumber = response.page_number
        this.pageSize = response.page_size
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


displayFn(value: any): string {
  return value && value.name ? value.name : '';
}

saveInfo(){
  this.userTariffForm.patchValue({
    country: this.userTariffForm.get('country')?.value.id,
  })
  this.nonCollapsableService.addInstalledCapacity(this.userTariffForm.value).subscribe((response)=> {
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

  //NG-FOR TRACKBY
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}