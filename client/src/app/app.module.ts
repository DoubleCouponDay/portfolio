import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoadingscreenComponent } from './loadingscreen/loadingscreen.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { vectorscomponent } from './vectors/vectors.component';
import { PagesModule } from './pages/pages.module';
import { backgroundcomponent } from './background/background.component';
import { TabletComponent } from './vectors/tablet/tablet.component';
import { BlocksComponent } from './vectors/blocks/blocks.component';
import { VectorsModule } from './vectors/vectors.module';

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
    BrowserAnimationsModule,
    VectorsModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
