import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { maximumtranslation, scrollmultiplier, mintranslationX, volumedecrement, scrapesoundpath, nomovementtimer, volumeincrement, volumestate, mintranslationY } from './scrollview.data';
import { Subject, Observable, pipe, MonoTypeOperatorFunction, of, interval } from 'rxjs';
import { throttleTime, filter, throttle, timeout } from 'rxjs/operators';
import { soundinteractioncooldown } from 'src/app/vectors/blocks/blocks.data';
import { SubSink } from 'subsink';
import { transformelement } from 'src/app/elementtranslator';
import { translatename, pixelunit } from 'src/app/animations/styleconstants';
import { isnullorundefined } from 'src/app/utilities';
import fadeout from 'src/app/animations/fadeout';
import { generatedraggable } from 'src/app/audio/generatedraggable';

@Component({
  selector: 'g[app-scrollview]',
  templateUrl: './scrollview.component.html',
  styleUrls: ['./scrollview.component.css']
})
export class ScrollviewComponent implements OnDestroy, AfterViewInit {

  @Output()
  scrollbuttonmoved: EventEmitter<number> = new EventEmitter()

  private scrollbuttonheld = false    

  private scrollbuttonposition: number = 0

  @ViewChildren('scrollbutton')
  scrollbuttonparts: QueryList<ElementRef>

  private castbuttonparts: SVGElement[]

  private sink = new SubSink()

  private scrapesoundgenerator = new generatedraggable(
    scrapesoundpath,
    volumeincrement,
    volumedecrement)

  constructor() { 

  }

  ngAfterViewInit() {
    this.castbuttonparts = this.scrollbuttonparts.map((item) => <SVGElement>item.nativeElement)
  }

  onscrollbuttonpressed(event: MouseEvent) {
    this.scrollbuttonheld = true
  }

  onscrollbuttonreleased(event: MouseEvent) {
    this.scrollbuttonheld = false
    console.log('audio stopped')
    this.scrapesoundgenerator.resetaudio()    
  }

  onmousemoveoverscroll(event: MouseEvent) {
    if(this.scrollbuttonheld === false) {
      return
    }
    let shouldmove = this.calculatescrollbuttonposition(event.movementY)

    if(shouldmove === false) {
      return
    }
    this.movescrollbutton()
    this.scrollbuttonmoved.emit()    
    this.scrapesoundgenerator.maintainaudio()  
    this.scrapesoundgenerator.startaudio()
  }

  /**
   * returns if button should move
   */
  private calculatescrollbuttonposition(unitchange: number): boolean {
    let chosenfutureposition = this.scrollbuttonposition + unitchange * scrollmultiplier

    if(chosenfutureposition > maximumtranslation) {
      chosenfutureposition = maximumtranslation       
    }

    else if(chosenfutureposition < mintranslationY) {
      chosenfutureposition = mintranslationY
    }
    let shouldplay = this.scrapesoundshouldplay(chosenfutureposition)
    this.scrollbuttonposition = shouldplay ? chosenfutureposition : this.scrollbuttonposition
    return shouldplay
  }

  private scrapesoundshouldplay(possiblefutureposition: number): boolean {
    if(possiblefutureposition === this.scrollbuttonposition) {
      return false
    }
    return true
  }

  private movescrollbutton() {
    this.castbuttonparts.forEach((item) => {
      transformelement(item, translatename, `${mintranslationX}${pixelunit}, ${this.scrollbuttonposition}${pixelunit}`)
    })    
  }

  ngOnDestroy(): void {
    this.sink.unsubscribe()
  }
}
