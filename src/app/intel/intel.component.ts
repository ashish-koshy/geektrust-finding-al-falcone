import { Observable } from 'rxjs';
import { PageSections } from '../enums';
import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ConvoySelectionService } from '../convoy-selection.service';
import { FalconePlanet, FalconeVehicle } from '../types';

@Component({
  selector: 'app-intel',
  templateUrl: './intel.component.html',
  styleUrls: ['./intel.component.scss']
})
export class IntelComponent {

  public pageSections = PageSections;
  public currentConvoyIndex: number = 1;
  public get planets(): Observable<FalconePlanet[]> {
    return this.convoySelectionService
               .availablePlanets();
  }
  public get vehicles(): Observable<FalconeVehicle[]> {
    return this.convoySelectionService
               .availableVehicles();    
  }


  constructor(
    @Inject(DOCUMENT) private documentRef: Document,
    private convoySelectionService: ConvoySelectionService
  ) {
    this.convoySelectionService
        .selectionUpdates()
        .subscribe(update => this.currentConvoyIndex = update.currentIndex || 1);
  }

  public focusTop(): void {
    this.documentRef
        .getElementById(PageSections.top)
        ?.scrollIntoView({ 
          behavior: 'smooth' 
        });
  }
}
