import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UiRoutes } from './enums';
import { HomeComponent } from './home/home.component';
import { ResultComponent } from './result/result.component';
import { ResultGuard } from './result.guard';

const routes: Routes = [
  {
    path: UiRoutes.home,
    component: HomeComponent
  },
  {
    path: UiRoutes.result,
    component: ResultComponent,
    canActivate: [ResultGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
