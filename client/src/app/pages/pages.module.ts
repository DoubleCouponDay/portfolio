import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfoliopageComponent } from './portfoliopage/portfoliopage.component';
import { websitespageComponent } from './websitespage/websitespage.component';
import { MusicpageComponent } from './musicpage/musicpage.component';
import { PageloaderDirective } from '../dynamic/pageloader/pageloader.directive';
import { softwarepageComponent } from './softwarepage/softwarepage.component';
import { ScrollviewComponent } from './scrollview/scrollview.component';
import {abstractpage} from './page.data';

@NgModule({
    declarations: [
        abstractpage,
        PortfoliopageComponent,
        websitespageComponent,
        softwarepageComponent,
        MusicpageComponent,
        PageloaderDirective,
        ScrollviewComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        PageloaderDirective,
        ScrollviewComponent
    ]
})
export class PagesModule { }
