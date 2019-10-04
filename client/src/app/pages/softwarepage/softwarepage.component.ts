import { Component, OnInit } from '@angular/core';
import { applytransformtoeachnode } from 'src/app/elementtranslator';
import { translatename, pixelunit } from 'src/app/animations/styleconstants';
import { scrollitemclass, pagecomponent, page } from '../page.data';

@Component({
  selector: 'svg:svg[app-softwarepage]',
  templateUrl: './softwarepage.component.html',
  styleUrls: ['./softwarepage.component.css', '../portfoliopage/portfoliopage.component.css' ]
})
export class softwarepageComponent extends pagecomponent implements page {

  contentlength = 800

  constructor() {
    super()
  }
}