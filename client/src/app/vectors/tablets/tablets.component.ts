import { Component, OnInit, Input, Type, OnDestroy } from '@angular/core';
import { PortfoliopageComponent } from 'src/app/pages/portfoliopage/portfoliopage.component';
import { MusicpageComponent } from 'src/app/pages/musicpage/musicpage.component';
import { lastpagenumber, firstpagenumber, websitespagenumber, softwarepagenumber } from 'src/app/pages/page.data';
import { tabletdata, currentpagerotation, tablettranslationposition, tablet2initialrotation,  tablet3initialrotation, tablet4initialrotation} from './tablet/tablet.data';
import { softwarepageComponent } from 'src/app/pages/softwarepage/softwarepage.component';
import { websitespageComponent } from 'src/app/pages/websitespage/websitespage.component';
import { PagingService } from 'src/app/services/paging.service';
import { SubSink } from 'subsink';
import { rotationtime } from 'src/app/animations/rotatetablet';
import { drawbridgesoundaddress } from 'src/app/audio/audio.data';

@Component({
  selector: 'g[app-tablets]',
  templateUrl: './tablets.component.html',
  styleUrls: ['./tablets.component.css']
})
export class TabletsComponent implements OnInit, OnDestroy {
  private currentpage = 0
  private initialized = false

  readonly tablet1data: tabletdata
  tablet1rotation: number

  readonly tablet2data: tabletdata
  tablet2rotation: number

  readonly tablet3data: tabletdata
  tablet3rotation: number

  readonly tablet4data: tabletdata
  tablet4rotation: number

  private sink = new SubSink()
  
  constructor(private _pagingservice: PagingService) { 
    this.tablet1data = {
      page: PortfoliopageComponent
    }

    this.tablet2data = {
      page: websitespageComponent
    }

    this.tablet3data = {
      page: softwarepageComponent
    }

    this.tablet4data = {
      page: MusicpageComponent
    }
    this.applyfirstpagestate()
    let sub1 = _pagingservice.subscribepagechange(this.onpagechange)
    this.sink.add(sub1)
  }

  ngOnInit() {
    this.initialized = true
  }

  private onpagechange = (newpage: number) => {
    if(newpage > lastpagenumber ||
      newpage < firstpagenumber)
    {
      throw new Error('selected new page is outside the boundaries of existence')
    }

    if(newpage === this.currentpage) {
      return      
    }
    this.choosenewrotations(newpage)      

    if(this.initialized === true) {
      this.playgearsaudio()
    }
    this.currentpage = newpage

    setTimeout(() => {
      this._pagingservice.emitpagecompletedmove(newpage)
    }, rotationtime)
  }  

  private choosenewrotations(newpagenumber: number) {
    switch(newpagenumber) {
      case firstpagenumber:
        this.applyfirstpagestate()
        break

      case websitespagenumber:
        this.applysecondpagestate()
        break

      case softwarepagenumber:
        this.applythirdpagestate()
        break

      case lastpagenumber:
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
    let gearssound = new Audio(drawbridgesoundaddress)
    gearssound.play()
  }

  ngOnDestroy() {
    this.sink.unsubscribe()
  }
}
