import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CKEditorModule } from 'ng2-ckeditor';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {CKEditorModule} from 'ng2-ckeditor';

import { AppRoutingModule } from './app-routing.module';
import {AppRoutingModule} from './app-routing.module';

import { ProfileService } from './profile.service';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing.component';
import {TabComponent } from './tab.component';
import { EditorComponent } from './editor.component';
import { CKEIntegrationComponent } from './cke-integration.component';
import { StyleEditorComponent } from './styleeditor.component';
import { EditViewComponent } from './editview.component';
import { ClipboardDirective } from './clipboard.directive';
import { DropdownParameterComponent } from './styleparameters/dropdown.component';
import {ProfileService} from './profile.service';
import {AppComponent} from './app.component';
import {LandingComponent} from './landing.component';
import {TabComponent} from './tab.component';
import {EditorComponent} from './editor.component';
import {CKEIntegrationComponent} from './cke-integration.component';
import {StyleEditorComponent} from './styleeditor.component';
import {EditViewComponent} from './editview.component';
import {ClipboardDirective} from './clipboard.directive';
import {DropdownParameterComponent} from './styleparameters/dropdown.component';
import {RegisterFormComponent} from './login-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    TabComponent,
    EditorComponent,
    CKEIntegrationComponent,
    StyleEditorComponent,
    EditViewComponent,
    DropdownParameterComponent,
    ClipboardDirective
    ClipboardDirective,
  ],
  imports: [
      BrowserModule,
      FormsModule,
      AppRoutingModule,
      HttpModule,
      CKEditorModule
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CKEditorModule,
  ],
  providers: [ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
export class AppModule {
}
