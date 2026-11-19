import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NonCollapsableService {

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

  uploadExcelFileToDB(file: File, moduleName:string): Observable<number> {
    const formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams();
    params = params.set('module', moduleName);

    return this.http.post(`${this.apiUrl}/upload-excel-module/`, formData, {
      params,
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
  
  getUserTariffs(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/user-tariffs/`, { params });
  }

  addUserTariffs(data: any) {
    return this.http.post<any>(`${this.apiUrl}/user-tariffs/`, data);
  }

  getUserTariffsSum(year: string, country:any) {
    let params = new HttpParams();
    if(country){
      params = params.set('county_ids', country);
    }
    return this.http.get<any>(`${this.apiUrl}/user-tariffs-sum/${year}/`, { params });
  }

  getGenerationMix(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/generation-mix/`, { params });
  }

  addGenerationMix(data: any) {
    return this.http.post<any>(`${this.apiUrl}/generation-mix/`, data);
  }

  getGenerationMixSum(year: string, country:any) {
    let params = new HttpParams();
    if(country){
      params = params.set('county_ids', country);
    }
    return this.http.get<any>(`${this.apiUrl}/generation-mix-sum/${year}/`, { params });
  }

  getGenerationContribSum(year: string, country:any) {
    let params = new HttpParams();
    if(country){
      params = params.set('county_ids', country);
    }
    return this.http.get<any>(`${this.apiUrl}/generation-contribution-sum/${year}/`, { params });
  }

  getSaidi(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/saidi/`, { params });
  }

  addSaidi(data: any) {
    return this.http.post<any>(`${this.apiUrl}/saidi/`, data);
  }

  getSaidiSum(year: string, country:any) {
    let params = new HttpParams();
    if(country){
      params = params.set('country_ids', country);
    }
    return this.http.get<any>(`${this.apiUrl}/saidi-sum/${year}/`, { params });
  }

  getSaifi(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/saifi/`, { params });
  }

  addSaifi(data: any) {
    return this.http.post<any>(`${this.apiUrl}/saifi/`, data);
  }

  getSaifiSum(year: string, country:any) {
    let params = new HttpParams();
    if(country){
      params = params.set('country_ids', country);
    }
    return this.http.get<any>(`${this.apiUrl}/saifi-sum/${year}/`, { params });
  }

  getInstalledCapacity(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/installed-capacity/`, { params });
  }

  addInstalledCapacity(data: any) {
    return this.http.post<any>(`${this.apiUrl}/installed-capacity/`, data);
  }

  getMaximumDemand(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/maximum-demand/`, { params });
  }

  addMaximumDemand(data: any) {
    return this.http.post<any>(`${this.apiUrl}/maximum-demand/`, data);
  }

  getGridConnectivity(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/grid-connectivity/`, { params });
  }

  addGridConnectivity(data: any) {
    return this.http.post<any>(`${this.apiUrl}/grid-connectivity/`, data);
  }

  getGridConnectivitySum( country:any) {
    let params = new HttpParams();
    if(country){
      params = params.set('county_ids', country);
    }
    return this.http.get<any>(`${this.apiUrl}/grid-connectivity-sum/`, { params });
  }

  getEffectiveCapacity(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/effective-capacity/`, { params });
  }

  addEffectiveCapacity(data: any) {
    return this.http.post<any>(`${this.apiUrl}/effective-capacity/`, data);
  }

  getNumberConnectedCustomers(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/number-of-connected-customers/`, { params });
  }

  addNumberConnectedCustomers(data: any) {
    return this.http.post<any>(`${this.apiUrl}/number-of-connected-customers/`, data);
  }

  getConnectedCustomersSum(year: string) {
    return this.http.get<any>(`${this.apiUrl}/connected-customers-sum/${year}/`);
  }

  getSystemLoadFactor(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/system-load-factor/`, { params });
  }

  addSystemLoadFactor(data: any) {
    return this.http.post<any>(`${this.apiUrl}/system-load-factor/`, data);
  }

  getSystemLoadFactorSum( country:any) {
    let params = new HttpParams();
    if(country){
      params = params.set('county_ids', country);
    }
    return this.http.get<any>(`${this.apiUrl}/system-load-factor-sum/`, { params });
  }

  getConsumptionPerCapital(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/consumption-per-capital/`, { params });
  }

  addConsumptionPerCapital(data: any) {
    return this.http.post<any>(`${this.apiUrl}/consumption-per-capital/`, data);
  }

  getConsumptionPerCapitalSum(year: string) {
    return this.http.get<any>(`${this.apiUrl}/consumption-per-capital-sum/${year}/`);
  }


  getCountry(pageNumber: number, pageSize: number, searchQuery: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.set('search', searchQuery);
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    } else {
      params = params.set('page', pageNumber);
      params = params.set('page_size', pageSize);
    }
    return this.http.get<any>(`${this.apiUrl}/country/`, { params });
  }

  addCountry(data: any) {
    return this.http.post<any>(`${this.apiUrl}/country/`, data);
  }

  getAdmin1() {
    return this.http.get<any>(`${this.apiUrl}/view_administrative_level1/`);
  }

  addAdmin1(data: any) {
    return this.http.post<any>(`${this.apiUrl}/create_administrative_level1/`, data);
  }



  getCrossBorderTariffSum( country:any) {
    let params = new HttpParams();
    if(country){
      params = params.set('county_ids', country);
    }
    return this.http.get<any>(`${this.apiUrl}/cross-border-tariff-sum/`, { params });
  }


  getCapacity( country:any) {
    let params = new HttpParams();
    if(country){
      params = params.set('county_ids', country);
    }
    return this.http.get<any>(`${this.apiUrl}/get-capacity-data/`, { params });
  }
}
