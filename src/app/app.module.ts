import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { IntelComponent } from './intel/intel.component';
import { ErrorComponent } from './error/error.component';
import { LoaderComponent } from './loader/loader.component';
import { ResultComponent } from './result/result.component';
import { ConvoyCardComponent } from './convoy-card/convoy-card.component';
import { PlanetCardComponent } from './planet-card/planet-card.component';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    IntelComponent,
    ResultComponent,
    LoaderComponent,
    ErrorComponent,
    PlanetCardComponent,
    VehicleCardComponent,
    ConvoyCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      /**
       * Register the ServiceWorker as soon as the app is stable
       * or after 30 seconds (whichever comes first).
       */
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
