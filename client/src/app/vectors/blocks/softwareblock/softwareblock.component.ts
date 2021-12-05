import { Component, OnInit } from '@angular/core';
import { softwarepagenumber } from 'src/app/pages/page.data';
import { abstractblock } from '../block';
import { minboxtranslation } from '../blocks.data';
import { AnimationBuilder } from '@angular/animations';
import { mouseservice } from 'src/app/services/mouse.service';
import { PagingService } from 'src/app/services/paging.service';

@Component({
  selector: 'g[app-softwareblock]',
  templateUrl: './softwareblock.component.html',
  styleUrls: ['./softwareblock.component.css']
})
export class SoftwareblockComponent extends abstractblock {
  translationY = minboxtranslation

  matchingpagenumber = softwarepagenumber

  constructor(animationbuilder: AnimationBuilder, _mouseservice: mouseservice, _pagingservice: PagingService) {
    super(animationbuilder, _mouseservice, _pagingservice)
  }
}