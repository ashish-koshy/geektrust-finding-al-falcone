import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { ConvoySelectionService } from '../convoy-selection.service';
import { FalconeVehicle } from '../types';
import { PageSections } from '../enums';
import { config } from '../constants';

@Component({
  selector: 'app-vehicle-card',
  templateUrl: './vehicle-card.component.html',
  styleUrls: ['./vehicle-card.component.scss']
})
export class VehicleCardComponent {  
  public vehicle: FalconeVehicle | undefined;
  public imagePath: string | undefined = '';
  
  private currentConvoyIndex: number = 1;

  @Input() public set input(value: FalconeVehicle | undefined) {
    this.vehicle = value; 
    this.imagePath 
      = value?.name 
        ? `${config.image.paths.vehicles}/${value.name.replace(/\s/g, '-') || ''}.svg` 
          : config.image.paths.empty;
  }

  constructor(
    @Inject(DOCUMENT) private documentRef: Document,
    private convoySelectionService: ConvoySelectionService
  ) {
    this.convoySelectionService
        .selectionUpdates()
        .subscribe(update => this.currentConvoyIndex = update.currentIndex || 1);
  }

  public selectVehicle(): void {
    this.documentRef
        .getElementById(`${PageSections.convoy}${this.currentConvoyIndex}`)
        ?.scrollIntoView({ 
          behavior: 'smooth' 
        });
    this.vehicle && 
      this.convoySelectionService.selectVehicle(this.vehicle.name);
  }
}
