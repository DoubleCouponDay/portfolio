import { Component, OnInit, ViewChildren } from '@angular/core';
import { page } from '../Page.interface';
import { applytransformtoeachnode } from 'src/app/elementtranslator';
import { pixelunit, translatename } from 'src/app/animations/styleconstants';

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
    let scrollitems = document.querySelectorAll(".scroll-item")
    applytransformtoeachnode(scrollitems, translatename, `0${pixelunit}, ${this.currentpageposition}${pixelunit}`)
  }
}
