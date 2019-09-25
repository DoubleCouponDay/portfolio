import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { maximumtranslation, minimumtranslation } from './scrollview.data';
import { Subject, Observable, pipe } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { soundinteractioncooldown } from 'src/app/vectors/blocks/blocks.data';
import { SubSink } from 'subsink';
import { translateelement } from 'src/app/elementtranslator';

@Component({
  selector: 'app-scrollview',
  templateUrl: './scrollview.component.html',
  styleUrls: ['./scrollview.component.css']
})
export class ScrollviewComponent implements OnInit, OnDestroy {

  @Output()
  scrollbuttonmoved: EventEmitter<number> = new EventEmitter()

  private scrollbuttonheld: boolean = false
  private scrollbuttonposition: number = 0

  @ViewChild('scrollbutton', {static: true})
  scrollbutton: ElementRef

  private castbutton: SVGElement

  private onscroll = this.scrollbuttonmoved.asObservable()
  private scrollaudio = new Audio('assets/tabletscraping.mp3') 

  private sink = new SubSink()

  constructor() { 
    let sub = this.onscroll.pipe(
      throttleTime(soundinteractioncooldown)
    )
    .subscribe(() => {
      this.scrollaudio.play()
    })

    this.sink.add(sub)
  }

  ngOnInit() {
    this.castbutton = <SVGElement>this.scrollbutton.nativeElement
  }

  onscrollbuttonpressed(event: MouseEvent) {
    this.scrollbuttonheld = true
  }

  onscrollbuttonreleased(event: MouseEvent) {
    this.scrollbuttonheld = false
  }

  onmousemoveoverscroll(event: MouseEvent) {
    if(this.scrollbuttonheld === false) {
      return
    }
    let shouldmove = this.calculatescrollbuttonposition(event.movementY)

    if(shouldmove) {
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
      chosenfutureposition = unitchange
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
    translateelement()
  }

  ngOnDestroy(): void {
    this.sink.unsubscribe()
  }
}
