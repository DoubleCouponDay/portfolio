import { Component, OnInit, Input, Output, Type, ElementRef, ViewChild } from '@angular/core';
import { PortfoliopageComponent } from 'src/app/pages/portfoliopage/portfoliopage.component';
import { page } from 'src/app/pages/Page.interface';
import { AnimationBuilder } from '@angular/animations';
import { tabletstate } from '../tabletstate';

@Component({
  selector: 'g[app-tablet]',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.css']
})
export class TabletComponent implements OnInit {

  @Input()
  injectedcontent: Type<page>

  @Input()
  startingrotation: number

  @Input()
  translationposition: [number, number]

  @ViewChild('tablet', {static: true})
  private tabletelement: ElementRef

  private tabletsstate: tabletstate

  constructor(private animationbuilder: AnimationBuilder) {
    
  }

  ngOnInit() {
    this.tabletsstate = new tabletstate(
      this.animationbuilder,
      this.startingrotation,
      this.translationposition,
      this.tabletelement
    )
  }
}
