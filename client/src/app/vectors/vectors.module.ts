import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from './blocks/blocks.component';
import { TabletComponent } from './tablets/tablet/tablet.component';
import { vectorscomponent } from './vectors.component';
import { PagesModule } from '../pages/pages.module';
import { TabletsComponent } from './tablets/tablets.component';
import { PortfolioblockComponent } from './blocks/portfolioblock/portfolioblock.component';
import { WebsitesblockComponent } from './blocks/websitesblock/websitesblock.component';
import { SoftwareblockComponent } from './blocks/softwareblock/softwareblock.component';
import { MusicblockComponent } from './blocks/musicblock/musicblock.component';
import { FlagComponent } from './flag/flag.component';
import { abstractblock } from './blocks/block';

@NgModule({
  declarations: [
    abstractblock,
    BlocksComponent,
    TabletComponent,
    vectorscomponent,
    TabletsComponent,
    PortfolioblockComponent,
    WebsitesblockComponent,
    SoftwareblockComponent,
    MusicblockComponent,
    FlagComponent
  ],
  imports: [
    CommonModule,
    PagesModule
  ],
  exports: [
    vectorscomponent
  ]
})
export class VectorsModule { }
