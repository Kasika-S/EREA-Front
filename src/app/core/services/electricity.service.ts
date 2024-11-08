import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectricityService {
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
  
  getElectricityLoss(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/electricity-loss/`, { params });
  }

  addElectricityLoss(data: any) {
    return this.http.post<any>(`${this.apiUrl}/electricity-loss/`, data);
  }

  getElectricityRegulatory(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/electricity-regulatory-index/`, { params });
  }

  addElectricityRegulatory(data: any) {
    return this.http.post<any>(`${this.apiUrl}/electricity-regulatory-index/`, data);
  }

  getElectricityGovernance(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/electricity-governance-index/`, { params });
  }

  addElectricityGovernance(data: any) {
    return this.http.post<any>(`${this.apiUrl}/electricity-governance-index/`, data);
  }

  getElectricitySubstance(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/electricity-substance-index/`, { params });
  }

  addElectricitySubstance(data: any) {
    return this.http.post<any>(`${this.apiUrl}/electricity-substance-index/`, data);
  }


  getElectricityOutcome(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/electricity-outcome-index/`, { params });
  }

  addElectricityOutcome(data: any) {
    return this.http.post<any>(`${this.apiUrl}/electricity-outcome-index/`, data);
  }

  getElectricityAccessRate(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/electricity-access-rate/`, { params });
  }

  addElectricityAccessRate(data: any) {
    return this.http.post<any>(`${this.apiUrl}/electricity-access-rate/`, data);
  }
}
