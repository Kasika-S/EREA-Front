import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  imports: [ MatTableModule, CommonModule, MatPaginatorModule],
  templateUrl: './preview-dialog.component.html',
  styleUrl: './preview-dialog.component.scss'
})

export class PreviewDialogComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>; // Use MatTableDataSource to enable pagination

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<PreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[]
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.length > 0) {
      // Extract headers from the first row
      this.displayedColumns = this.data[0];

      // Convert rows to objects with headers as keys
      const tableData = this.data.slice(1).map(row => {
        const rowData: any = {};
        this.displayedColumns.forEach((col, index) => {
          rowData[col] = row[index] || ''; // Handle missing data
        });
        return rowData;
      });

      // Initialize MatTableDataSource with the transformed data
      this.dataSource = new MatTableDataSource(tableData);
    }
  }

  ngAfterViewInit() {
    // Set the paginator after view init
    this.dataSource.paginator = this.paginator;
  }

  onUpload(): void {
    this.dialogRef.close('upload');
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
