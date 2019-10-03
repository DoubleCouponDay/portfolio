import { Component, OnInit } from '@angular/core';
import { scrollitemclass, pagecomponent } from '../page.data';
import { applytransformtoeachnode } from 'src/app/elementtranslator';
import { translatename, pixelunit } from 'src/app/animations/styleconstants';

@Component({
  selector: 'svg:svg[app-musicpage]',
  templateUrl: './musicpage.component.html',
  styleUrls: ['./musicpage.component.css', '../portfoliopage/portfoliopage.component.css']
})
export class MusicpageComponent extends pagecomponent {
  constructor() {
    super()
  }
}