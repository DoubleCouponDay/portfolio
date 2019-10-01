import { Component, OnInit } from '@angular/core';
import { page, scrollitemclass } from '../page.data';
import { applytransformtoeachnode } from 'src/app/elementtranslator';
import { translatename, pixelunit } from 'src/app/animations/styleconstants';

@Component({
  selector: 'svg:svg[app-musicpage]',
  templateUrl: './musicpage.component.html',
  styleUrls: ['./musicpage.component.css', '../portfoliopage/portfoliopage.component.css']
})
export class MusicpageComponent implements OnInit, page {
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
