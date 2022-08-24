import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { imagesBasePath, config } from '../constants';
import { FindFalconeUiStatus, ResultParameters } from '../enums';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent {

  public planetImage: string = '';
  public responseImage: string = '';
  public responseMessage: string = '';
  public totalTimeTaken: number = 0;
  public planetFound: boolean = false;
  public alFalconeFound: boolean = false;
  public resetMessage = FindFalconeUiStatus.reset;

  constructor(activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe(params => {
      this.alFalconeFound 
        = params[ResultParameters.success];
      this.planetFound 
        = params[ResultParameters.planetFound];
      this.totalTimeTaken 
        = params[ResultParameters.timeTaken] || 0;
      this.planetImage 
        = this.planetFound
            ? `${config.image.paths.planets}/${this.planetFound}.svg`
                : config.image.paths.empty;
      this.responseMessage 
        = this.alFalconeFound 
            ? FindFalconeUiStatus.success : FindFalconeUiStatus.failure;
      this.responseImage 
        = this.alFalconeFound
            ? `${imagesBasePath}/misc/Success.svg` : `${imagesBasePath}/misc/Error.svg`;

    });
  }
}
