import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';


@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],

  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss'
})
export class DeleteDialogComponent {

    //CONSTRUCTOR
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
  ) { }

  closeDialog(){
    this.dialogRef.close()
  }

}
