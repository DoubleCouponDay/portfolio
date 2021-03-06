import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingscreenComponent } from './loadingscreen/loadingscreen.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PagesModule } from './pages/pages.module';
import { backgroundcomponent } from './background/background.component';
import { VectorsModule } from './vectors/vectors.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    backgroundcomponent,
    LoadingscreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    PagesModule,
    VectorsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
