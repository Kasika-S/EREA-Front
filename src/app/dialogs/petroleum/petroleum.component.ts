import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NgClass } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PetroleumService } from '../../core/services/petroleum.service';

@Component({
  selector: 'dialog-petroleum',
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './petroleum.component.html',
  styleUrl: './petroleum.component.scss'
})
export class PetroleumDialogComponent implements OnInit{

    //FORM GROUP NAME
    petroleumForm!: UntypedFormGroup;

    //CONSTRUCTOR
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<PetroleumDialogComponent>,
    private route: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
    private petroleumService: PetroleumService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.petroleumForm = this._formBuilder.group({
      name: [null],
    });
  }

  saveInfo(){
    this.petroleumService.addPetroleumProducts(this.petroleumForm.value).subscribe((response)=> {
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
}