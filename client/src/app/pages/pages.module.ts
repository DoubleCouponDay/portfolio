import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfoliopageComponent } from './portfoliopage/portfoliopage.component';
import { websitespageComponent } from './websitespage/websitespage.component';
import { MusicpageComponent } from './musicpage/musicpage.component';
import { PageloaderDirective } from './pageloader/pageloader.directive';
import { softwarepageComponent } from './softwarepage/softwarepage.component';

@NgModule({
  declarations: [
    PortfoliopageComponent, websitespageComponent, softwarepageComponent, MusicpageComponent, PageloaderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PortfoliopageComponent,
    PageloaderDirective
  ],
  entryComponents: [PortfoliopageComponent, websitespageComponent, softwarepageComponent, MusicpageComponent]
})
export class PagesModule { }
