import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from './blocks/blocks.component';
import { TabletComponent } from './tablet/tablet.component';
import { vectorscomponent } from './vectors.component';

@NgModule({
  declarations: [
    BlocksComponent,
    TabletComponent,
    vectorscomponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    vectorscomponent
  ]
})
export class VectorsModule { }
