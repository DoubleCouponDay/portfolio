import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from './blocks/blocks.component';
import { TabletComponent } from './tablets/tablet/tablet.component';
import { vectorscomponent } from './vectors.component';
import { PagesModule } from '../pages/pages.module';
import { TabletsComponent } from './tablets/tablets.component';

@NgModule({
  declarations: [
    BlocksComponent,
    TabletComponent,
    vectorscomponent,
    TabletsComponent
  ],
  imports: [
    CommonModule,
    PagesModule,
  ],
  exports: [
    vectorscomponent
  ]
})
export class VectorsModule { }
