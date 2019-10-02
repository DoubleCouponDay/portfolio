import { Component, OnInit } from '@angular/core';
import { Blockcomponent } from '../block';
import { AnimationBuilder } from '@angular/animations';
import { mouseservice } from 'src/app/services/mouse.service';
import { maxboxtranslation } from '../blocks.data';
import { firstpagenumber } from 'src/app/pages/page.data';

@Component({
  selector: 'app-portfolioblock',
  templateUrl: './portfolioblock.component.html',
  styleUrls: ['./portfolioblock.component.css']
})
export class PortfolioblockComponent extends Blockcomponent {
  translationY = maxboxtranslation

  matchingpagenumber = firstpagenumber

  constructor(animationbuilder: AnimationBuilder, _mouseservice: mouseservice) {
    super(animationbuilder, _mouseservice)
  }
}