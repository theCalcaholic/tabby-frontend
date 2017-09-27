import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing.component';
import { EditViewComponent } from './editview.component';

const routes: Routes = [
  { path: 'edit/:id', component: EditViewComponent },
  { path: '', component: LandingComponent },
  //{ path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
