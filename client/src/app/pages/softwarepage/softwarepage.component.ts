import { Component, OnInit } from '@angular/core';
import { applytransformtoeachnode } from 'src/app/elementtranslator';
import { translatename, pixelunit } from 'src/app/animations/styleconstants';
import { page, scrollitemclass } from '../page.data';

@Component({
  selector: 'svg:svg[app-softwarepage]',
  templateUrl: './softwarepage.component.html',
  styleUrls: ['./softwarepage.component.css', '../portfoliopage/portfoliopage.component.css' ]
})
export class softwarepageComponent implements OnInit, page {
  private currentpageposition: number = 0
  
  constructor() { }

  ngOnInit() {
  }

  onscroll(newY: number) {
    let potentialnewposition = this.currentpageposition - newY
    this.currentpageposition = potentialnewposition
    let scrollitems = document.querySelectorAll(scrollitemclass)
    applytransformtoeachnode(scrollitems, translatename, `0${pixelunit}, ${this.currentpageposition}${pixelunit}`)
  }
}
