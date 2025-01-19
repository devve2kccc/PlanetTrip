import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTripPage } from './add-trip.page';

const routes: Routes = [
  {
    path: '',
    component: AddTripPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTripPageRoutingModule {}
