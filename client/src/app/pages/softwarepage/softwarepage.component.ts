import { Component, OnInit } from '@angular/core';
import { applytransformtoeachnode } from 'src/app/elementtransformer';
import { translatename, pixelunit } from 'src/app/animations/animation.data';
import { scrollitemclass, pagecomponent, page } from '../page.data';

@Component({
  selector: 'svg:svg[app-softwarepage]',
  templateUrl: './softwarepage.component.html',
  styleUrls: ['./softwarepage.component.css', '../pages.css']
})
export class softwarepageComponent extends pagecomponent implements page {

  contentlength = 50

  constructor() {
    super()
  }
}