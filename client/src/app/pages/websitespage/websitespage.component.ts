import { Component, OnInit, ViewChildren } from '@angular/core';
import { applytransformtoeachnode } from 'src/app/elementtranslator';
import { pixelunit, translatename } from 'src/app/animations/styleconstants';
import { scrollitemclass, pagecomponent } from '../page.data';

@Component({
  selector: 'svg:svg[app-websitespage]',
  templateUrl: './websitespage.component.html',
  styleUrls: ['./websitespage.component.css', '../portfoliopage/portfoliopage.component.css']
})
export class websitespageComponent extends pagecomponent {
  constructor() {
    super()
  }
}
