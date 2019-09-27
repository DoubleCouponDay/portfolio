import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { maximumtranslation, minimumtranslation } from './scrollview.data';
import { Subject, Observable, pipe } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { soundinteractioncooldown } from 'src/app/vectors/blocks/blocks.data';
import { SubSink } from 'subsink';
import { transformelement } from 'src/app/elementtranslator';
import { translatename, pixelunit } from 'src/app/animations/styleconstants';

@Component({
  selector: 'g[app-scrollview]',
  templateUrl: './scrollview.component.html',
  styleUrls: ['./scrollview.component.css']
})
export class ScrollviewComponent implements OnDestroy, AfterViewInit {

  @Output()
  scrollbuttonmoved: EventEmitter<number> = new EventEmitter()

  private scrollbuttonheld: boolean = false
  private scrollbuttonposition: number = 0

  @ViewChildren('scrollbutton')
  scrollbuttonparts: QueryList<ElementRef>

  private castbuttonparts: SVGElement[]

  private onscroll = this.scrollbuttonmoved.asObservable()
  private scrollaudio: HTMLAudioElement

  private sink = new SubSink()

  constructor() { 
    let sub = this.onscroll.pipe(
      throttleTime(soundinteractioncooldown)
    )
    .subscribe(() => {
      this.scrollaudio = new Audio('assets/tabletscraping.mp3') 
      this.scrollaudio.play()
    })

    this.sink.add(sub)
  }

  ngAfterViewInit() {
    this.castbuttonparts = this.scrollbuttonparts.map((item) => <SVGElement>item.nativeElement)
  }

  onscrollbuttonpressed(event: MouseEvent) {
    this.scrollbuttonheld = true
  }

  onscrollbuttonreleased(event: MouseEvent) {
    this.scrollbuttonheld = false
    this.scrollaudio = null
  }

  onmousemoveoverscroll(event: MouseEvent) {
    if(this.scrollbuttonheld === false) {
      return
    }
    let shouldmove = this.calculatescrollbuttonposition(event.movementY)

    if(shouldmove === true) {
      this.movescrollbutton()
      this.scrollbuttonmoved.emit()
    }
  }

  /**
   * returns if button should move
   */
  private calculatescrollbuttonposition(unitchange: number): boolean {
    let chosenfutureposition: number

    if(unitchange > maximumtranslation) {
      chosenfutureposition = maximumtranslation       
    }

    else if(unitchange < minimumtranslation) {
      chosenfutureposition = minimumtranslation
    }

    else {
      chosenfutureposition = this.scrollbuttonposition + unitchange
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
      transformelement(item, translatename, `0${pixelunit}, ${this.scrollbuttonposition}${pixelunit}`)
    })    
  }

  ngOnDestroy(): void {
    this.sink.unsubscribe()
  }
}
