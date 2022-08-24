
import { ConvoySelectionService } from '../convoy-selection.service';
import { Component, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FalconePlanet } from '../types';
import { PageSections } from '../enums';
import { config } from '../constants';

@Component({
  selector: 'app-planet-card',
  templateUrl: './planet-card.component.html',
  styleUrls: ['./planet-card.component.scss']
})
export class PlanetCardComponent {
  
  public planet: FalconePlanet | undefined;
  public imagePath: string | undefined = '';

  @Input() public set input(value: FalconePlanet | undefined) {
    this.planet = value;
    this.imagePath 
      = value?.name 
        ? `${config.image.paths.planets}/${value?.name || ''}.svg` 
          : config.image.paths.empty;
  }

  constructor(
    @Inject(DOCUMENT) private documentRef: Document,
    private convoySelectionService: ConvoySelectionService
  ) {}

  public selectPlanet(): void {
    this.documentRef
        .getElementById(PageSections.vehicles)
        ?.scrollIntoView({ 
          behavior: 'smooth' 
        });
    this.planet &&
      this.convoySelectionService.selectPlanet(this.planet.name);
  }
} 
