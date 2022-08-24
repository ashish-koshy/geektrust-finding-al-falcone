import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { ConvoySelectionService } from '../convoy-selection.service';
import { Observable } from 'rxjs';
import { PageSections } from '../enums';
import { FalconePlanet, FalconeVehicle } from '../types';

@Component({
  selector: 'app-convoy-card',
  templateUrl: './convoy-card.component.html',
  styleUrls: ['./convoy-card.component.scss']
})
export class ConvoyCardComponent { 
  @Input() public index!: number;

  constructor(
    @Inject(DOCUMENT) private documentRef: Document,
    private convoySelectionService: ConvoySelectionService,
  ) {}

  public selectConvoy(): void {
    this.documentRef
        .getElementById(PageSections.planets)
        ?.scrollIntoView({ 
          behavior: 'smooth'
        });
    this.index && 
      this.convoySelectionService.selectConvoy(this.index);
  }

  public selection(index: number): Observable<{
    planet: FalconePlanet | undefined, 
    vehicle: FalconeVehicle | undefined 
  } | undefined> {
    return this.convoySelectionService
               .getConvoySelection(index); 
  }
}
