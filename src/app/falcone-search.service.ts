import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, forkJoin, lastValueFrom, map, Observable, of, timeout } from 'rxjs';
import { FalconePlanet, FalconeVehicle, FindFalconeResponse, GetTokenResponse, FalconeSearch } from './types';
import { ApiPaths, FindFalconeApiStatus } from './enums';
import { HttpService } from './http.service';
import { config } from './constants';

@Injectable({
  providedIn: 'root'
})
export class FalconeSearchService {
  private falconeSearch = new BehaviorSubject<FalconeSearch>({
    loading: true,
    planets: [],
    vehicles: [],
    request: {
      token: '',
      planet_names: [],
      vehicle_names: [],
    },
    response: {
      planet_name: '',
      status: ''
    },
    error: undefined
  });
  private get getSearch(): FalconeSearch { 
    return this.falconeSearch.value; 
  };
  private set setSearch(update: FalconeSearch) { 
    this.falconeSearch.next(update); 
  };

  constructor(private httpService: HttpService) {
    this.setToken();
    this.setPlanetsAndVehicles();
  }

  private setApiError(error: HttpErrorResponse): void {
    const search = this.getSearch;
    search.loading = false;
    error && (search.error = error || undefined);
    this.setSearch = search;
  }

  private async setToken(): Promise<void> {
    const search = this.getSearch;
    let response!: GetTokenResponse;
    search.loading = true;
    this.setSearch = search;
    try {
      const httpOptions = { 
        headers: { 
          'Accept': 'application/json' 
        } 
      };
      const tokenSource 
        = this.httpService
              .post(ApiPaths.getToken, null, httpOptions)
              .pipe(timeout(config.apiTimeoutMs));
      response = (await lastValueFrom(tokenSource)) as GetTokenResponse;
    } catch (error) {
      this.setApiError(error as HttpErrorResponse);
    } finally {
      search.loading = false;
      search.request.token = response?.token || '';
      this.setSearch = search;
    }
  }

  private setPlanetsAndVehicles(): void {
    const search = this.getSearch;
    search.loading = true;
    this.setSearch = search;
    forkJoin([
      this.httpService.get(ApiPaths.getPlanets), 
      this.httpService.get(ApiPaths.getVehicles)
    ]).pipe(
      timeout(config.apiTimeoutMs),
      catchError((error: HttpErrorResponse) => {
        this.setApiError(error);
        return of([[], []]);
      })).subscribe(response => {
        search.loading = false;
        search.planets = (response[0] || []) as FalconePlanet[];
        search.vehicles = (response[1] || []) as FalconeVehicle[];
        this.setSearch = search;
      });
  }

  private getResults(): Observable<FindFalconeResponse> {
    const httpOptions = { 
      headers: { 
        'Accept': 'application/json', 
        'Content-Type' : 'application/json'  
      } 
    };
    const search = this.getSearch;
    return this.httpService
               .post(
                  ApiPaths.findFalcone, 
                  search.request,
                  httpOptions
                ) as Observable<FindFalconeResponse>;
  }

  public resetSearch(): void { 
    const search = this.getSearch;
    search.error = undefined;
    search.loading = false;
    search.request = {
      token: '',
      planet_names: [],
      vehicle_names: [],
    };
    search.response = {
      planet_name: '',
      status: ''
    };
    this.setSearch = search;
    this.setToken();
    this.setPlanetsAndVehicles();
  }

  public getSearchState(): Observable<FalconeSearch> {
    return this.falconeSearch.asObservable();
  }

  public findFalcone(
    planetNames: string[], 
    vehicleNames: string[]
  ): Observable<FindFalconeResponse | HttpErrorResponse> {
    const search = this.getSearch;
    search.loading = true;
    search.request.planet_names = planetNames || [];
    search.request.vehicle_names = vehicleNames || [];
    this.setSearch = search;
    return this.getResults()
               .pipe(
                  timeout(config.apiTimeoutMs),
                  catchError(
                    async (errorResponse: HttpErrorResponse) => {
                      if (errorResponse?.error === FindFalconeApiStatus.tokenExpired) {
                        await this.setToken();
                        this.findFalcone(planetNames, vehicleNames);
                      }
                      this.setApiError(errorResponse);
                      return errorResponse;
                    }
                  ),
                  map(
                    searchResponse => {
                      const response = searchResponse as FindFalconeResponse;
                      search.loading = false;
                      search.response = response;
                      this.setSearch = search;
                      return searchResponse;
                    }
                  )
                );
  }
}
