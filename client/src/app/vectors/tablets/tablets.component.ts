import { Component, OnInit, Input, Type } from '@angular/core';
import { page } from 'src/app/pages/Page.interface';
import { PortfoliopageComponent } from 'src/app/pages/portfoliopage/portfoliopage.component';
import { MusicpageComponent } from 'src/app/pages/musicpage/musicpage.component';
import { totalpagesamount, firstpagenumber, softwarepagenumber, hardwarepagenumber } from 'src/app/pages/pageconstants';
import { tabletdata, currentpagerotation, tablettranslationposition, tablet2initialrotation,  tablet3initialrotation, tablet4initialrotation} from './tablet/tablet.data';
import { softwarepageComponent } from 'src/app/pages/softwarepage/softwarepage.component';
import { websitespageComponent } from 'src/app/pages/websitespage/websitespage.component';

@Component({
  selector: 'g[app-tablets]',
  templateUrl: './tablets.component.html',
  styleUrls: ['./tablets.component.css']
})
export class TabletsComponent implements OnInit {
  private currentpagefield = 0
  private initialized = false

  @Input()
  set inputcurrentpage(input: number) {
    if(input > totalpagesamount ||
      input < firstpagenumber)
    {
      throw new Error('selected new page is outside the boundaries of existence')
    }

    if(input !== this.currentpagefield) {
      this.choosenewrotations(input)      
    }

    if(this.initialized === true) {
      this.playgearsaudio()
    }
    this.currentpagefield = input
  }

  readonly tablet1data: tabletdata
  tablet1rotation: number

  readonly tablet2data: tabletdata
  tablet2rotation: number

  readonly tablet3data: tabletdata
  tablet3rotation: number

  readonly tablet4data: tabletdata
  tablet4rotation: number
  
  constructor() { 
    this.tablet1data = {
      page: PortfoliopageComponent,
      translationposition: tablettranslationposition
    }

    this.tablet2data = {
      page: websitespageComponent,
      translationposition: tablettranslationposition
    }

    this.tablet3data = {
      page: softwarepageComponent,
      translationposition: tablettranslationposition
    }

    this.tablet4data = {
      page: MusicpageComponent,
      translationposition: tablettranslationposition
    }
    this.applyfirstpagestate()
  }

  ngOnInit() {
    this.initialized = true
  }

  private choosenewrotations(newpagenumber: number) {
    switch(newpagenumber) {
      case firstpagenumber:
        this.applyfirstpagestate()
        break

      case softwarepagenumber:
        this.applysecondpagestate()
        break

      case hardwarepagenumber:
        this.applythirdpagestate()
        break

      case totalpagesamount:
        this.applyfourthpagestate()
        break
    }
  }

  private applyfirstpagestate() {
    this.tablet1rotation = currentpagerotation
    this.tablet2rotation = tablet2initialrotation
    this.tablet3rotation = tablet3initialrotation
    this.tablet4rotation = tablet4initialrotation
  }

  private applysecondpagestate() {
    this.tablet1rotation = tablet4initialrotation
    this.tablet2rotation = currentpagerotation
    this.tablet3rotation = tablet2initialrotation
    this.tablet4rotation = tablet3initialrotation
  }

  private applythirdpagestate() {
    this.tablet1rotation = tablet3initialrotation
    this.tablet2rotation = tablet4initialrotation
    this.tablet3rotation = currentpagerotation
    this.tablet4rotation = tablet2initialrotation
  }

  private applyfourthpagestate() {
    this.tablet1rotation = tablet2initialrotation
    this.tablet2rotation = tablet3initialrotation
    this.tablet3rotation = tablet4initialrotation
    this.tablet4rotation = currentpagerotation
  }

  private playgearsaudio() {
    let gearssound = new Audio('assets/drawbridge.mp3')
    gearssound.play()
  }
}
