import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Blockcomponent } from 'src/app/vectors/blocks/block';
import { AnimationBuilder } from '@angular/animations';
import { mouseservice } from 'src/app/services/mouse.service';
import { minboxtranslation } from '../blocks.data';
import { lastpagenumber } from 'src/app/pages/page.data';

@Component({
  selector: 'app-musicblock',
  templateUrl: './musicblock.component.html',
  styleUrls: ['./musicblock.component.css']
})
export class MusicblockComponent extends Blockcomponent {
  translationY = minboxtranslation

  matchingpagenumber = lastpagenumber

  constructor(animationbuilder: AnimationBuilder, _mouseservice: mouseservice) {
    super(animationbuilder, _mouseservice)
  }
}
