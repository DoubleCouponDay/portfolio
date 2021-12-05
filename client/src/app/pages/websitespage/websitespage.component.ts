import { Component, OnInit, ViewChildren } from '@angular/core';
import { applytransformtoeachnode } from 'src/app/elementtransformer';
import { pixelunit, translatename } from 'src/app/animations/animation.data';
import { scrollitemclass, abstractpage, page } from '../page.data';

@Component({
  selector: 'svg:svg[app-websitespage]',
  templateUrl: './websitespage.component.html',
  styleUrls: ['./websitespage.component.css', '../pages.css']
})
export class websitespageComponent extends abstractpage implements page {
  
  contentlength = 80

  constructor() {
    super()
  }
}
