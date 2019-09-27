import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { maximumtranslation, minimumtranslation, scrollmultiplier, translationX, volumedecrement, pathtoaudio, nomovementtimer, maxvolume, volumeincrement } from './scrollview.data';
import { Subject, Observable, pipe, MonoTypeOperatorFunction, of, interval } from 'rxjs';
import { throttleTime, filter, throttle, timeout } from 'rxjs/operators';
import { soundinteractioncooldown } from 'src/app/vectors/blocks/blocks.data';
import { SubSink } from 'subsink';
import { transformelement } from 'src/app/elementtranslator';
import { translatename, pixelunit } from 'src/app/animations/styleconstants';
import { isnullorundefined } from 'src/app/utilities';
import fadeout from 'src/app/animations/fadeout';

@Component({
  selector: 'g[app-scrollview]',
  templateUrl: './scrollview.component.html',
  styleUrls: ['./scrollview.component.css']
})
export class ScrollviewComponent implements OnDestroy, AfterViewInit {

  @Output()
  scrollbuttonmoved: EventEmitter<number> = new EventEmitter()

  private scrollbuttonheld = false  
  private throttleinput = false

  private scrollbuttonposition: number = 0

  @ViewChildren('scrollbutton')
  scrollbuttonparts: QueryList<ElementRef>

  private castbuttonparts: SVGElement[]

  private scrollaudio: HTMLAudioElement = new Audio(pathtoaudio) 

  private sink = new SubSink()

  private timeoutIDs = new Array<number>()

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
    this.state3_audioreset()
    clearInterval()
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
    this.state2_audiomaintained()

    if(this.throttleinput === true) {
      return
    }    
    this.state1_audiostart()
  }

  private state1_audiostart() {    
    this.scrollaudio = new Audio(pathtoaudio) 
    this.scrollaudio.play()    
    this.fadeoutaudio()
    this.throttleinput = true
  }

  private state2_audiomaintained() {
    this.fadeupaudio()
  }

  private state3_audioreset() {
    this.throttleinput = false    

    this.fadeoutaudio(() => {
      this.timeoutIDs.forEach((value) => {
        clearTimeout(value)
      })
    })    
  }

  /** invoke after movement detection */
  private fadeoutaudio(onfaded?: () => void)
  {
    let id = setTimeout(() => {
      if(this.scrollaudio.volume >= volumedecrement) {        
        this.scrollaudio.volume -= volumedecrement
        this.fadeoutaudio()
      }

      else {
        this.scrollaudio.pause()
        this.throttleinput = false

        if(isnullorundefined(onfaded)) {
          return
        }
        onfaded()
      }    
    })
    this.timeoutIDs.push(id)    
  }

  private fadeupaudio() {
    let id = setTimeout(() => {
      if(this.scrollaudio.volume <= maxvolume - volumeincrement) { //prevents out of bounds exc
        this.scrollaudio.volume += volumeincrement
        this.fadeupaudio()
      }
    })
    this.timeoutIDs.push(id)
  }

  /**
   * returns if button should move
   */
  private calculatescrollbuttonposition(unitchange: number): boolean {
    let chosenfutureposition = this.scrollbuttonposition + unitchange * scrollmultiplier

    if(chosenfutureposition > maximumtranslation) {
      chosenfutureposition = maximumtranslation       
    }

    else if(chosenfutureposition < minimumtranslation) {
      chosenfutureposition = minimumtranslation
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
      transformelement(item, translatename, `${translationX}${pixelunit}, ${this.scrollbuttonposition}${pixelunit}`)
    })    
  }

  ngOnDestroy(): void {
    this.sink.unsubscribe()
  }
}
