import { Component, OnInit, ViewChildren } from '@angular/core';
import { applytransformtoeachnode } from 'src/app/elementtranslator';
import { pixelunit, translatename } from 'src/app/animations/styleconstants';
import { scrollitemclass, page } from '../page.data';

@Component({
  selector: 'svg:svg[app-websitespage]',
  templateUrl: './websitespage.component.html',
  styleUrls: ['./websitespage.component.css', '../portfoliopage/portfoliopage.component.css']
})
export class websitespageComponent implements OnInit, page {
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
