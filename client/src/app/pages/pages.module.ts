import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfoliopageComponent } from './portfoliopage/portfoliopage.component';
import { websitespageComponent } from './websitespage/websitespage.component';
import { MusicpageComponent } from './musicpage/musicpage.component';
import { PageloaderDirective } from '../dynamic/pageloader/pageloader.directive';
import { softwarepageComponent } from './softwarepage/softwarepage.component';
import { ScrollviewComponent } from './scrollview/scrollview.component';
import { MusicblockComponent } from './musicblock/musicblock.component';
import { PortfolioblockComponent } from './portfolioblock/portfolioblock.component';
import { SoftwareblockComponent } from './softwareblock/softwareblock.component';
import { WebsitesblockComponent } from './websitesblock/websitesblock.component';

@NgModule({
  declarations: [
    PortfoliopageComponent, websitespageComponent, softwarepageComponent, MusicpageComponent, PageloaderDirective, ScrollviewComponent, MusicblockComponent, PortfolioblockComponent, SoftwareblockComponent, WebsitesblockComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PageloaderDirective,
    ScrollviewComponent
  ],
  entryComponents: [PortfoliopageComponent, websitespageComponent, softwarepageComponent, MusicpageComponent, MusicblockComponent, PortfolioblockComponent, SoftwareblockComponent, WebsitesblockComponent]
})
export class PagesModule { }
