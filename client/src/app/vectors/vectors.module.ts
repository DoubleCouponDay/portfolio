import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from './blocks/blocks.component';
import { TabletComponent } from './tablets/tablet/tablet.component';
import { vectorscomponent } from './vectors.component';
import { PagesModule } from '../pages/pages.module';
import { PageloaderDirective } from '../pages/pageloader/pageloader.directive';
import { PortfoliopageComponent } from '../pages/portfoliopage/portfoliopage.component';
import { MusicpageComponent } from '../pages/musicpage/musicpage.component';
import { TabletsComponent } from './tablets/tablets.component';
import { ScrollviewComponent } from './tablets/tablet/scrollview/scrollview.component';

@NgModule({
  declarations: [
    BlocksComponent,
    TabletComponent,
    vectorscomponent,
    TabletsComponent,
    ScrollviewComponent
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
