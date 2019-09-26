import { Component, OnInit } from '@angular/core';
import { page } from '../Page.interface';
import { applytransformtoeachnode } from 'src/app/elementtranslator';
import { pixelunit, translatename } from 'src/app/animations/styleconstants';

@Component({
  selector: 'svg:svg[app-websitespage]',
  templateUrl: './websitespage.component.html',
  styleUrls: ['./websitespage.component.css', '../portfoliopage/portfoliopage.component.css']
})
export class websitespageComponent implements OnInit, page {

  constructor() { }

  ngOnInit() {
  }

  onscroll(newY: number) {
    let scrollitems = document.querySelectorAll(".scroll-item")
    applytransformtoeachnode(scrollitems, translatename, `0${pixelunit}, ${-newY}${pixelunit}`)
  }
}
