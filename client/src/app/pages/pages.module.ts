import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfoliopageComponent } from './portfoliopage/portfoliopage.component';
import { SoftwarepageComponent } from './softwarepage/softwarepage.component';
import { HardwarepageComponent } from './hardwarepage/hardwarepage.component';
import { MusicpageComponent } from './musicpage/musicpage.component';
import { PageloaderDirective } from './pageloader/pageloader.directive';

@NgModule({
  declarations: [
    PortfoliopageComponent, SoftwarepageComponent, HardwarepageComponent, MusicpageComponent, PageloaderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PortfoliopageComponent,
    PageloaderDirective
  ],
  entryComponents: [PortfoliopageComponent, SoftwarepageComponent, HardwarepageComponent, MusicpageComponent]
})
export class PagesModule { }
