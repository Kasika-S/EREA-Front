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

import { NonCollapsableService } from '../../core/services/non-collapsable.service';
import { PetroleumService } from '../../core/services/petroleum.service';

@Component({
  selector: 'app-generation-mix',
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
  ], 
  templateUrl: './generation-mix.component.html',
  styleUrl: './generation-mix.component.scss'
})

export class GenerationMixDialogComponent implements OnInit{

  //FORM GROUP NAME
  generationMixForm!: UntypedFormGroup;

  country: any[] = [];
  electricity_source: any[] = [
    'hydro',
    'solar',
    'wind',
    'thermal',
    'biomass',
    'methane',
    'peat',
    'geothermal',
    'imports',
];

  //SEARCHING
   searchCountry: string = '';
   searchPetroleumProduct: string = '';


  //PAGINATION
   totalItems: number = 0;
   pageSize: number = 10;
   pageNumber: number = 1;

  //CONSTRUCTOR
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private dialogRef: MatDialogRef<GenerationMixDialogComponent>,
  private route: ActivatedRoute,
  private _formBuilder: UntypedFormBuilder,
  private nonCollapsableService: NonCollapsableService,
  private petroleumService: PetroleumService,
  private router: Router
) { }

ngOnInit(): void {
  this.generationMixForm = this._formBuilder.group({
    country: [null],
    electricity_source: [null],
    contribution: [null],
  });
}

getCountry() {
  if(true){
    this.pageNumber = 1
    this.searchCountry = this.generationMixForm.get('country')?.value
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
  this.generationMixForm.patchValue({
    country: this.generationMixForm.get('country')?.value.id,
  })
  console.log("testing", this.generationMixForm.value)
  this.nonCollapsableService.addGenerationMix(this.generationMixForm.value).subscribe((response)=> {
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
