import { Component, OnInit } from '@angular/core';
import { minboxtranslation } from '../blocks.data';
import { Blockcomponent } from '../block';
import { AnimationBuilder } from '@angular/animations';
import { mouseservice } from 'src/app/services/mouse.service';
import { websitespagenumber } from 'src/app/pages/page.data';

@Component({
  selector: 'app-websitesblock',
  templateUrl: './websitesblock.component.html',
  styleUrls: ['./websitesblock.component.css']
})
export class WebsitesblockComponent extends Blockcomponent {
  translationY = minboxtranslation

  matchingpagenumber = websitespagenumber

  constructor(animationbuilder: AnimationBuilder, _mouseservice: mouseservice) {
    super(animationbuilder, _mouseservice)
  }
}