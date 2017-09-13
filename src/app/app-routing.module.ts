import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './landing.component';
import { EditorComponent } from './editor.component';

const routes: Routes = [
  { path: 'edit/:id', component: EditorComponent },
  { path: '', component: LandingComponent },
  //{ path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
