import { Component, OnInit } from '@angular/core';
import { softwarepagenumber } from 'src/app/pages/page.data';
import { Blockcomponent } from '../block';
import { minboxtranslation } from '../blocks.data';
import { AnimationBuilder } from '@angular/animations';
import { mouseservice } from 'src/app/services/mouse.service';
import { PagingService } from 'src/app/services/paging.service';
import snackbarservice from 'src/app/services/snackbar.service';

@Component({
  selector: 'g[app-softwareblock]',
  templateUrl: './softwareblock.component.html',
  styleUrls: ['./softwareblock.component.css']
})
export class SoftwareblockComponent extends Blockcomponent {
  translationY = minboxtranslation

  matchingpagenumber = softwarepagenumber

  constructor(animationbuilder: AnimationBuilder, _mouseservice: mouseservice, _pagingservice: PagingService,
    alerter: snackbarservice) {
    super(animationbuilder, _mouseservice, _pagingservice, alerter)
  }
}