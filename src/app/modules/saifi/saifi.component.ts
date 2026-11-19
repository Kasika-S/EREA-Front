import { AsyncPipe, I18nPluralPipe, NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule,MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { PetroleumDialogComponent } from '../../dialogs/petroleum/petroleum.component';
import { PetroleumService } from '../../core/services/petroleum.service';
import { PreviewDialogComponent } from '../../dialogs/preview-dialog/preview-dialog.component';

import * as XLSX from 'xlsx';
import { NonCollapsableService } from '../../core/services/non-collapsable.service';
import { SaifiDialogComponent } from '../../dialogs/saifi/saifi.component';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-saifi',
  standalone: true,
  imports: [
    RouterOutlet,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    MatMenuModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    RouterLink,
    AsyncPipe,
    I18nPluralPipe,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
],
  templateUrl: './saifi.component.html',
  styleUrl: './saifi.component.scss'
})

export class SaifiComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  //TABLE
  displayedColumns: string[] = ['id', 'saifi', 'country','more_options'];
  petroleumProduct: any[] = [];

  //PAGINATION
  totalItems: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  pageSizeOptions = [10, 25, 50, 100];

  //FILE UPLOAD
  selectedFile: File | null = null;
  selectedFileName: string = ''; // For displaying selected file name
  uploadProgress: number = 0; // Progress percentage

  //LOADER
  isLoading:boolean = true

  //SEARCHING
  searchQuery: string = '';

  constructor(private nonCollapsableService: NonCollapsableService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getSaifi()
  }

  getSaifi() {
    if(this.searchQuery){
      this.pageNumber = 1
    }
    this.nonCollapsableService.getSaifi(this.pageNumber, this.pageSize,this.searchQuery).subscribe(
      {
        next: (response) => {
          this.petroleumProduct = response.results
          this.totalItems = response.count
          this.pageNumber = response.page_number
          this.pageSize = response.page_size
        },
        error: (error) => {
          console.log(error.message)
          this.snackBar.open(error.message, 'Close', { duration: 5000 }); // Notify user
        },
        complete: () => {
          this.isLoading = false
        }
      }
    )
  }

  //PAGINATION
  onPageChange(event: any): void {
    this.pageNumber = event.pageIndex + 1;  // MatPaginator's pageIndex is zero-based
    this.pageSize = event.pageSize;
    this.getSaifi();
  }


  //DIALOG
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(
      SaifiDialogComponent,
      {
        width: '50%',
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  //FILE
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile?.name || ''; // Update the file name
    this.onFileChange(event);
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      console.error('Please select a single file');
      return;
    }

    const file = target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // Assuming the data is in the first sheet
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Convert the sheet to JSON format
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Open dialog and pass the data
      this.openPreviewDialog(data);
    };

    reader.readAsBinaryString(file);
  }

  openPreviewDialog(data: any[]): void {
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '80%',
      height: '80%',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'upload') {
        console.log('Upload confirmed');
        // Code to handle upload goes here
      }
    });
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.nonCollapsableService.uploadExcelFileToDB(this.selectedFile,"saifi").subscribe({
        next: (progress) => {
          if (progress >= 0) {
            this.uploadProgress = progress; // Update progress
          }
        },
        error: (error) => {
          console.error('Error uploading file', error);
        },
        complete: () => {
          console.log('Upload complete');
          this.uploadProgress = 0; // Reset progress after completion
          this.pageNumber = 1
          this.getSaifi();
          this.selectedFile = null;
          this.selectedFileName = "";
          this.snackBar.open('File uploaded successfully!', 'Close', { duration: 3000 }); // Notify user
        }
      });
    } else {
      console.error('No file selected');
      this.snackBar.open('Please select a file to upload.', 'Close', { duration: 3000 });
    }
  }

  openDeleteDialog(id:number) {
    const dialogRef = this.dialog.open(
      DeleteDialogComponent,
      {
        width: '30%',
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.deleteData(id);
      }
    });
  }

  deleteData(id:number) {
    // this.petroleumService.deletePetroleumProducts(id).subscribe({
    //   next: (response) => {
    //     console.log('Data deleted!', response);
    //   },
    //   error: (error) => {
    //     console.error('Error uploading file', error);
    //   },
    //   complete: () => {
    //     // this.getPetroleumProduct()
    //   }
    // });
  }
}