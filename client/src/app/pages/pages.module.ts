import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfoliopageComponent } from './portfoliopage/portfoliopage.component';
import { websitespageComponent } from './websitespage/websitespage.component';
import { MusicpageComponent } from './musicpage/musicpage.component';
import { PageloaderDirective } from '../dynamic/pageloader/pageloader.directive';
import { softwarepageComponent } from './softwarepage/softwarepage.component';
import { ScrollLoaderDirective } from '../dynamic/scrollLoader/scrollLoader.directive';

@NgModule({
  declarations: [
    PortfoliopageComponent, websitespageComponent, softwarepageComponent, MusicpageComponent, PageloaderDirective, ScrollLoaderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PortfoliopageComponent,
    PageloaderDirective,
    ScrollLoaderDirective
  ],
  entryComponents: [PortfoliopageComponent, websitespageComponent, softwarepageComponent, MusicpageComponent]
})
export class PagesModule { }
