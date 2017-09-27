import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from 'ng2-ckeditor';

import { AppRoutingModule } from './app-routing.module';

import { ProfileService } from './profile.service';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing.component';
import {TabComponent } from './tab.component';
import { EditorComponent } from './editor.component';
import { CKEIntegrationComponent } from './cke-integration.component';
import { StyleEditorComponent } from './styleeditor.component';
import { EditViewComponent } from './editview.component';
import { ClipboardDirective } from './clipboard.directive';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    TabComponent,
    EditorComponent,
    CKEIntegrationComponent,
    StyleEditorComponent,
    EditViewComponent,
    ClipboardDirective
  ],
  imports: [
      BrowserModule,
      FormsModule,
      AppRoutingModule,
      HttpModule,
      CKEditorModule
  ],
  providers: [ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
