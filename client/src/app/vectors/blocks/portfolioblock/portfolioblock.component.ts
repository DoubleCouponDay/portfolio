import { Component, OnInit } from '@angular/core';
import { Blockcomponent } from '../block';
import { AnimationBuilder } from '@angular/animations';
import { mouseservice } from 'src/app/services/mouse.service';
import { maxboxtranslation } from '../blocks.data';
import { firstpagenumber } from 'src/app/pages/page.data';
import { PagingService } from 'src/app/services/paging.service';

@Component({
  selector: 'g[app-portfolioblock]',
  templateUrl: './portfolioblock.component.html',
  styleUrls: ['./portfolioblock.component.css']
})
export class PortfolioblockComponent extends Blockcomponent  {
  translationY = maxboxtranslation

  matchingpagenumber = firstpagenumber

  constructor(animationbuilder: AnimationBuilder, _mouseservice: mouseservice, _pagingservice: PagingService) {
    super(animationbuilder, _mouseservice, _pagingservice)
  }
}