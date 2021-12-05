import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { abstractblock } from 'src/app/vectors/blocks/block';
import { AnimationBuilder } from '@angular/animations';
import { mouseservice } from 'src/app/services/mouse.service';
import { minboxtranslation } from '../blocks.data';
import { lastpagenumber } from 'src/app/pages/page.data';
import { PagingService } from 'src/app/services/paging.service';

@Component({
  selector: 'g[app-musicblock]',
  templateUrl: './musicblock.component.html',
  styleUrls: ['./musicblock.component.css']
})
export class MusicblockComponent extends abstractblock {
  translationY = minboxtranslation

  matchingpagenumber = lastpagenumber

  constructor(animationbuilder: AnimationBuilder, _mouseservice: mouseservice, _pagingservice: PagingService) {
    super(animationbuilder, _mouseservice, _pagingservice)
  }
}
