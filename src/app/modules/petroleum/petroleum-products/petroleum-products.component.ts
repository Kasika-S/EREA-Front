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

import { PetroleumDialogComponent } from '../../../dialogs/petroleum/petroleum.component';
import { PetroleumImportResult, PetroleumService } from '../../../core/services/petroleum.service';
import { PreviewDialogComponent } from '../../../dialogs/preview-dialog/preview-dialog.component';

import * as XLSX from 'xlsx';
import { DeleteDialogComponent } from '../../../dialogs/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-petroleum-products',
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
  templateUrl: './petroleum-products.component.html',
  styleUrl: './petroleum-products.component.scss'
})
export class PetroleumProductsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  //TABLE
  displayedColumns: string[] = ['id', 'name','more_options'];
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
  previewData: any[] = [];
  isUploading = false;

  //LOADER
  isLoading:boolean = true

  //SEARCHING
  searchQuery: string = '';

  constructor(private petroleumService: PetroleumService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getPetroleumProduct()
  }

  getPetroleumProduct() {
    if(this.searchQuery){
      this.pageNumber = 1
    }
    this.petroleumService.getPetroleumProducts(this.pageNumber, this.pageSize,this.searchQuery).subscribe(
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
    this.getPetroleumProduct();
  }


  //DIALOG
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(
      PetroleumDialogComponent,
      {
        width: '50%',
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
    this.petroleumService.deletePetroleumProducts(id).subscribe({
      next: (response) => {
        console.log('Data deleted!', response);
      },
      error: (error) => {
        console.error('Error uploading file', error);
      },
      complete: () => {
        this.getPetroleumProduct()
      }
    });
  }

  //FILE
  onFileSelected(event: any): void {
    const file = event.target.files[0] as File | undefined;
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      this.snackBar.open('Please select an Excel .xlsx file.', 'Close', { duration: 4000 });
      event.target.value = '';
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = this.selectedFile?.name || '';
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
      const buffer: ArrayBuffer = e.target.result as ArrayBuffer;
      const wb: XLSX.WorkBook = XLSX.read(buffer, { type: 'array' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Open dialog and pass the data
      if (data.length < 2) {
        this.snackBar.open('The selected workbook has no data rows to import.', 'Close', { duration: 4000 });
        return;
      }

      const headers = (data[0] as unknown[]).map((header) => String(header ?? '').trim().toLowerCase());
      if (!headers.includes('name')) {
        this.resetSelectedFile();
        this.snackBar.open('The template requires a "name" column.', 'Close', { duration: 5000 });
        return;
      }

      const nameIndex = headers.indexOf('name');
      const names = new Set<string>();
      const invalidRow = data.slice(1).findIndex((row: any) => {
        const name = String(row[nameIndex] ?? '').trim();
        if (!name || names.has(name.toLocaleLowerCase())) {
          return true;
        }
        names.add(name.toLocaleLowerCase());
        return false;
      });
      if (invalidRow !== -1) {
        this.resetSelectedFile();
        this.snackBar.open(`Row ${invalidRow + 2} has a blank or duplicate product name.`, 'Close', { duration: 5000 });
        return;
      }

      this.previewData = data;
    };

    reader.readAsArrayBuffer(file);
  }

  openPreviewDialog(data: any[]): void {
    const dialogRef = this.dialog.open(PreviewDialogComponent, {
      width: '80%',
      maxHeight: '80vh',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'upload') {
        this.onUpload();
      }
    });
  }

  onUpload(): void {
    if (this.selectedFile && !this.isUploading) {
      this.isUploading = true;
      this.uploadProgress = 35;
      this.petroleumService.importPetroleumProducts(this.selectedFile).subscribe({
        next: (response: PetroleumImportResult) => {
          this.uploadProgress = 100;
          const { created, skipped_existing } = response.summary;
          const suffix = skipped_existing ? ` ${skipped_existing} existing product${skipped_existing === 1 ? '' : 's'} skipped.` : '';
          this.snackBar.open(`${created} product${created === 1 ? '' : 's'} imported.${suffix}`, 'Close', { duration: 6000 });
        },
        error: (error) => {
          this.isUploading = false;
          const rowError = error?.error?.errors?.[0];
          const message = rowError
            ? `Row ${rowError.row}: ${rowError.message}`
            : error?.error?.detail || error?.error?.message || error?.error?.error || 'The file could not be uploaded. Please check the spreadsheet and try again.';
          this.snackBar.open(message, 'Close', { duration: 6000 });
        },
        complete: () => {
          this.uploadProgress = 0;
          this.pageNumber = 1
          this.getPetroleumProduct();
          this.resetSelectedFile();
          this.isUploading = false;
        }
      });
    } else {
      console.error('No file selected');
      this.snackBar.open('Please select a file to upload.', 'Close', { duration: 3000 });
    }
  }

  downloadTemplate(): void {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['name'],
      ['Example product name'],
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Petroleum products');
    XLSX.writeFile(workbook, 'erea-petroleum-products-template.xlsx');
  }

  private resetSelectedFile(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.previewData = [];
  }
}
