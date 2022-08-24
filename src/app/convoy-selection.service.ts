import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { ConvoySelection, FalconePlanet, FalconeSearch, FalconeVehicle } from './types';
import { FalconeSearchService } from './falcone-search.service';
import { config } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ConvoySelectionService {
  private selections = new BehaviorSubject<ConvoySelection>({
    currentIndex: 1,
    planetSelection: new Map(),
    vehicleSelection: new Map()
  });

  private get getSelection(): ConvoySelection {
    return this.selections?.value;
  }

  private set setSelection(selection: ConvoySelection) {
    selection && this.selections.next(selection);
  }

  constructor(private falconeSearchService: FalconeSearchService) {}

  public selectConvoy(index: number): void {
    const selection = this.getSelection;
    selection.planetSelection.delete(`${index}`);
    selection.vehicleSelection.delete(`${index}`);
    selection.currentIndex = index;
    this.setSelection = selection;
  }

  public selectPlanet(planetName: string): void {
    const selection = this.getSelection;
    selection.vehicleSelection.delete(`${selection.currentIndex}`);
    selection.planetSelection.set(`${selection.currentIndex}`, planetName);
    this.setSelection = selection;
  }

  public selectVehicle(vehicleName: string): void {
    const selection = this.getSelection;
    selection.planetSelection.get(`${selection.currentIndex}`) &&
    selection.vehicleSelection.set(`${selection.currentIndex}`, vehicleName) &&
    (this.setSelection = selection);
  }

  public resetSelections(): void {
    this.selections.next({
      currentIndex: 1,
      planetSelection: new Map(),
      vehicleSelection: new Map()
    });
  }

  public selectionUpdates(): Observable<ConvoySelection> {
    return this.selections.asObservable();
  }

  public availablePlanets(): Observable<FalconePlanet[]> {
    return combineLatest([
      this.falconeSearchService.getSearchState(),
      this.selectionUpdates()
    ]).pipe(
      map(
        state => {
          const search = state[0];
          const selection = state[1];
          const selectedPlanets = new Set(selection.planetSelection.values());
          return search.planets.filter(planet => !selectedPlanets.has(planet.name)) || [];
        }
      )
    )
  }

  public availableVehicles(): Observable<FalconeVehicle[]> {
    return combineLatest([
      this.falconeSearchService.getSearchState(),
      this.selectionUpdates()
    ]).pipe(
      map(
        state => {
          const search = state[0];
          const selection = state[1];
          const selectedPlanetName: string
            = selection.planetSelection.get(`${selection.currentIndex}`) || '';
          const selectedPlanetDistance 
            = search.planets?.filter(planet => planet.name === selectedPlanetName).shift()?.distance || 0;
          const selectedVehicles = Array.from(selection.vehicleSelection.values());
          const vehicleCountMap = new Map<string, number>();
          for (const vehicleName of selectedVehicles) {
            const vehicleCount = vehicleCountMap.get(vehicleName) || 0;
            vehicleCountMap.set(vehicleName, vehicleCount + 1);  
          } 
          return search
            .vehicles
            .map(
              vehicle => {
                vehicle.available_no 
                  = vehicle.total_no - (vehicleCountMap.get(vehicle.name) || 0);
                return vehicle;
              }
            ).filter(vehicle => 
              vehicle.available_no > 0 
                && vehicle.max_distance >= selectedPlanetDistance
            );
        }
      )
    )
  }

  public getTotalTimeTaken(): Observable<number> {
    return combineLatest([
      this.falconeSearchService.getSearchState(),
      this.selectionUpdates()
    ]).pipe(
      map(
        state => {
          let totalTimeTaken = 0;
          const search = state[0] as FalconeSearch;
          const selection = state[1] as ConvoySelection;
          for (let index = 1; index <= config.convoyLimit; index++) {
            const key = `${index}`;
            const planetName = selection.planetSelection.get(key) || '';
            const vehicleName = selection.vehicleSelection.get(key) || '';
            const planet 
              = search
                  .planets
                  .filter(planet => planet.name === planetName)
                  .shift();
            const vehicle 
              = search
                .vehicles
                .filter(vehicle => vehicle.name === vehicleName)
                .shift();
            planet?.distance &&
            vehicle?.speed &&
            (totalTimeTaken += (planet.distance || 0)/(vehicle.speed || 1));
          }
          return totalTimeTaken;
        }
      )
    );
  }

  public getConvoySelection(index: number): Observable<{
    planet: FalconePlanet | undefined, 
    vehicle: FalconeVehicle | undefined 
  } | undefined> {
    const key = `${index}`;
    return combineLatest([
      this.falconeSearchService.getSearchState(),
      this.selectionUpdates()
    ]).pipe(
      map(
        state => {
          const search = state[0];
          const selection = state[1];
          const planetName = selection.planetSelection.get(key) || '';
          const vehicleName = selection.vehicleSelection.get(key) || '';
          return {
            planet: search
                      .planets
                      .filter(planet => planet.name === planetName).shift(),
            vehicle: search
                      .vehicles
                      .filter(vehicle => vehicle.name === vehicleName).shift()               
          };
        }
      )
    )
  }
}
