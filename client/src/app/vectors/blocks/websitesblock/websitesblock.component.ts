import { Component, OnInit } from '@angular/core';
import { minboxtranslation } from '../blocks.data';
import { abstractblock } from '../block';
import { AnimationBuilder } from '@angular/animations';
import { mouseservice } from 'src/app/services/mouse.service';
import { websitespagenumber } from 'src/app/pages/page.data';
import { PagingService } from 'src/app/services/paging.service';

@Component({
  selector: 'g[app-websitesblock]',
  templateUrl: './websitesblock.component.html',
  styleUrls: ['./websitesblock.component.css']
})
export class WebsitesblockComponent extends abstractblock {
  translationY = minboxtranslation

  matchingpagenumber = websitespagenumber

  constructor(animationbuilder: AnimationBuilder, _mouseservice: mouseservice, _pagingservice: PagingService) {
    super(animationbuilder, _mouseservice, _pagingservice)
  }
}