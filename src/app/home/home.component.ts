import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ConvoySelectionService } from '../convoy-selection.service';
import { FalconeSearchService } from '../falcone-search.service';
import { FindFalconeApiStatus, PageSections, ResultParameters, UiRoutes } from '../enums';
import { ConvoySelection, FalconeSearch, FindFalconeResponse } from '../types';
import { config } from '../constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public totalTimeTaken: number = 0;
  public pageSections = PageSections;
  public convoys = new Array(config.convoyLimit);

  public get falconeSearchState(): Observable<FalconeSearch> {
    return this.falconeSearchService.getSearchState();
  }

  public get readyForResults(): Observable<boolean> {
    return  this.convoySelectionService
                .selectionUpdates()
                .pipe(
                  map(
                    selection => {
                      const readyForResults 
                        = selection.planetSelection.size === config.convoyLimit 
                            && selection.vehicleSelection.size === config.convoyLimit;
                      readyForResults && 
                      this.documentRef
                          .getElementById(PageSections.top)
                          ?.scrollIntoView({ 
                            behavior: 'smooth' 
                          });
                      return readyForResults;
                    }
                  )
                );
  }

  private selections!: ConvoySelection;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private documentRef: Document,
    private falconeSearchService: FalconeSearchService,
    private convoySelectionService: ConvoySelectionService
  ) {
    convoySelectionService
      .selectionUpdates()
      .subscribe(update => this.selections = update);
    convoySelectionService
      .getTotalTimeTaken()
      .subscribe(update => this.totalTimeTaken = update);
  }

  private showResults(searchResponse: FindFalconeResponse | HttpErrorResponse): void {
    const response = searchResponse as FindFalconeResponse;
    this.router.navigate([
      UiRoutes.result, {
        [ResultParameters.success]: 
          response?.status === FindFalconeApiStatus.success 
            ? response.status : ResultParameters.emptyResult,
        [ResultParameters.planetFound]: 
          response?.planet_name || ResultParameters.emptyResult,
        [ResultParameters.timeTaken]: this.totalTimeTaken || 0
      }
    ]);
  }

  public findFalcone(): void {
    const planetNames 
      = Array.from(this.selections.planetSelection.values()) || [];
    const vehicleNames 
      = Array.from(this.selections.vehicleSelection.values()) || [];
    this.falconeSearchService
        .findFalcone(planetNames, vehicleNames)
        .subscribe(searchResponse => this.showResults(searchResponse));
  }

  public ngOnInit(): void {
    this.convoySelectionService.resetSelections();
    this.falconeSearchService.resetSearch();
  }
}
