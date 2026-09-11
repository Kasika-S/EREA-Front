import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetroleumService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadExcelFile(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload-excel/`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.Sent:
            // Request has been sent
            return 0; // Progress 0%
          case HttpEventType.UploadProgress:
            // Upload progress
            if (event.total) {
              return Math.round((event.loaded / event.total) * 100); // Progress percentage
            }
            break;
          case HttpEventType.Response:
            // Response received
            return 100; // Progress 100%
        }
        return 0; // Default progress
      })
    );
  }

  importPetroleumProducts(file: File): Observable<PetroleumImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<PetroleumImportResult>(`${this.apiUrl}/upload-excel/`, formData);
  }

  uploadVolumeImportFile(file: File): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload-petroleum-volume/`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.Sent:
            // Request has been sent
            return 0; // Progress 0%
          case HttpEventType.UploadProgress:
            // Upload progress
            if (event.total) {
              return Math.round((event.loaded / event.total) * 100); // Progress percentage
            }
            break;
          case HttpEventType.Response:
            // Response received
            return 100; // Progress 100%
        }
        return 0; // Default progress
      })
    );
  }

  getPetroleumProducts(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/petroleum-products/`, { params });

    // return this.http.get<any>(`${this.apiUrl}/petroleum-products/?page=${pageNumber}&&page_size=${pageSize}`);
  }

  addPetroleumProducts(data: any) {
    return this.http.post<any>(`${this.apiUrl}/petroleum-products/`, data);
  }

  deletePetroleumProducts(id: any) {
    return this.http.delete<any>(`${this.apiUrl}/petroleum-products/${id}`);
  }

  getPetroleumPrice(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/petroleum-price/`, { params });

    // return this.http.get<any>(`${this.apiUrl}/petroleum-products/?page=${pageNumber}&&page_size=${pageSize}`);
  }

  addPetroleumPrice(data: any) {
    return this.http.post<any>(`${this.apiUrl}/petroleum-price/`, data);
  }

  getPetroleumMontlyPriceSum(year: string, product:any) {
    let params = new HttpParams();
    if(product){
      params = params.set('petroleum_product', product);
    }
    return this.http.get<any>(`${this.apiUrl}/monthly-petroleum-sum/${year}/`, { params });
  }

  getMonthlyPetroleumPrices(year: string, country_id:any) {
    let params = new HttpParams();
    if (country_id) {
      params = params.set('county_ids', country_id);
    }
    return this.http.get<any>(`${this.apiUrl}/monthly-petroleum-prices/${year}/`, { params });
  }

  getVolumeImports(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/volume-imports/`, { params });

    // return this.http.get<any>(`${this.apiUrl}/petroleum-products/?page=${pageNumber}&&page_size=${pageSize}`);
  }

  addVolumeImports(data: any) {
    return this.http.post<any>(`${this.apiUrl}/volume-imports/`, data);
  }

  getImportVolumeSum(year: string, country:any) {
    let params = new HttpParams();
    if(country){
      params = params.set('county_ids', country);
    }
    return this.http.get<any>(`${this.apiUrl}/volume-imports-sum/${year}/`, { params });
  }


}

export interface PetroleumImportResult {
  message: string;
  summary: {
    processed: number;
    created: number;
    skipped_existing: number;
  };
}
