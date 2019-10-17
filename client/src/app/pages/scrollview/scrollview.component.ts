import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { maximumtranslation, scrollmultiplier, mintranslationX, nomovementtimer, volumestate, mintranslationY, buttonidentifier, movementcalculation } from './scrollview.data';
import { SubSink } from 'subsink';
import { transformelement } from 'src/app/elementtransformer';
import { translatename, pixelunit } from 'src/app/animations/animation.data';
import { generatedraggableaudio } from 'src/app/audio/generatedraggableaudio';
import { mousehighlighter } from 'src/app/animations/mousehighlighter';
import { changetodragicon, resetmouse } from 'src/app/animations/mousechanger';
import { mouseservice } from 'src/app/services/mouse.service';
import { touchevents } from 'src/app/touch/touchevents';
import {snackbarservice} from 'src/app/services/snackbar.service';
import { tabletsoundaddress } from 'src/app/audio/audio.data';

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

  @ViewChildren(buttonidentifier)
  scrollbuttonparts: QueryList<ElementRef>

  private castbuttonparts: SVGElement[]

  private sink = new SubSink()

  private highlighter: mousehighlighter

  private scrapesoundgenerator = new generatedraggableaudio(tabletsoundaddress)
  private touches: touchevents

  constructor(private mouseservice: mouseservice) { 
    let sub1 = mouseservice.subscribemovedevent(this.onmousemoveoverscroll)
    let sub2 = mouseservice.subscribereleasedevent(this.onscrollbuttonreleased)
    this.sink.add(sub1)
    this.sink.add(sub2)    
  }

  ngAfterViewInit() {
    this.castbuttonparts = this.scrollbuttonparts.map((item) => <SVGElement>item.nativeElement)
    this.highlighter = new mousehighlighter(this.castbuttonparts[0].style.fill)

    this.touches = new touchevents(
      this.onscrollbuttonpressed, 
      this.onmousemoveoverscroll, 
      this.onscrollbuttonreleased, 
      ...this.castbuttonparts)
  }

  onscrollbuttonpressed = (event: MouseEvent) => {
    this.scrollbuttonheld = true
  }

  onscrollbuttonreleased = (event: MouseEvent) => {
    this.scrollbuttonheld = false
    this.scrapesoundgenerator.resetaudio()      
    resetmouse() 
  }

  private onmousemoveoverscroll = (event: MouseEvent) => {
    if(this.scrollbuttonheld === false) {
      return
    }    
    let outcome = this.calculatescrollbuttonposition(event.movementY)

    if(outcome.shouldmove === false) {
      return
    }
    this.movescrollbutton()
    this.scrollbuttonmoved.emit(outcome.changeinposition)        
    this.scrapesoundgenerator.playaudio()    
  }

  onmouseshouldhighlight(event: MouseEvent) {
    this.highlighter.applyhighlight(this.castbuttonparts[0])
    changetodragicon()
    this.onmousemoveoverscroll(event)
  }

  onmouseleavescroll(event: MouseEvent) {
    this.highlighter.resethighlight(this.castbuttonparts[0])    

    if(this.scrollbuttonheld === false) {
      resetmouse()
    }
  }

  /**
   * returns if button should move
   */
  private calculatescrollbuttonposition(unitchange: number): movementcalculation {
    let change = unitchange * scrollmultiplier
    let chosenfutureposition = this.scrollbuttonposition + change

    if(chosenfutureposition > maximumtranslation) {
      chosenfutureposition = maximumtranslation       
    }

    else if(chosenfutureposition < mintranslationY) {
      chosenfutureposition = mintranslationY
    }
    let shouldplay = this.scrapesoundshouldplay(chosenfutureposition)
    this.scrollbuttonposition = shouldplay ? chosenfutureposition : this.scrollbuttonposition

    return { 
      shouldmove: shouldplay,
      changeinposition: change
    }
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
    this.touches.ngOnDestroy()
  }
}
