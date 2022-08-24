import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpService } from './http.service';
import { ApiSourceType, PageSections } from './enums';
import { FalconeSearchService } from './falcone-search.service';
import { ConvoySelectionService } from './convoy-selection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'finding-falcone';
  public pageSections = PageSections;
  public apiSourceType = ApiSourceType;
  public apiSourceUrl!: Observable<string>;

  constructor(
    private convoySelectionService: ConvoySelectionService,
    private falconeSearchService: FalconeSearchService,
    private httpService: HttpService,
    private router: Router,
  ) {
    this.apiSourceUrl = this.httpService.apiSourceUpdates();
  }

  public reset(): void {
    this.convoySelectionService.resetSelections();
    this.falconeSearchService.resetSearch();
    this.router.navigate(['/']);
  }

  public changeAPISource(sourceType: ApiSourceType): void {
    this.httpService.setApiSource(sourceType);
    this.falconeSearchService.resetSearch();
  }
}
