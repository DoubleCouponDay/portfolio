import { Component, OnInit, ViewChild, ElementRef, Output, Type } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { box1name, box2name, box3name, box4name, idlabel, nooccurrence, maxboxtranslation, minboxtranslation } from './boxconstants';
import movetocursorhorizontally from '../animations/movetocursorhorizontally';
import { AnimationBuilder, AnimationFactory, animation, animate, style } from '@angular/animations';
import { of, Observable, Subscriber, observable, Subject } from 'rxjs';
import { throttleTime, filter, map, debounceTime, throttle } from 'rxjs/operators'
import { Snap } from 'snapsvg'
import { blockstate } from './blocks/blockstate';
import { page } from '../pages/Page.interface';
import { PortfoliopageComponent } from '../pages/portfoliopage/portfoliopage.component';
import { SoftwarepageComponent } from '../pages/softwarepage/softwarepage.component';
import { HardwarepageComponent } from '../pages/hardwarepage/hardwarepage.component';
import { MusicpageComponent } from '../pages/musicpage/musicpage.component';

export const tablet1translationposition = [0, 0]
export const tablet1initialrotation = 0

@Component({
  selector: 'app-vectors',
  templateUrl: './vectors.component.html',
  styleUrls: ['./vectors.component.css']
})
export class vectorscomponent implements OnInit {

  portfoliopage: Type<page> = PortfoliopageComponent
  softwarepage: Type<page> = SoftwarepageComponent
  hardwarepage: Type<page> = HardwarepageComponent
  musicpage: Type<page> = MusicpageComponent

  //boxes
  @ViewChild(box1name, { static: true })
  box1: ElementRef  
  private box1position: blockstate

  @ViewChild(box2name, { static: true })
  box2: ElementRef
  private box2position = new blockstate(box2name)

  @ViewChild(box3name, { static: true })
  box3: ElementRef
  private box3position = new blockstate(box3name)


  @ViewChild(box4name, { static: true })
  box4: ElementRef
  private box4position = new blockstate(box4name)

  currentelement: ElementRef  
  currentposition: blockstate
  boxmovefactory: AnimationFactory

  boxmovingsubject = new Subject<MouseEvent>()
  aboxismoving = this.boxmovingsubject.asObservable()

  blocksoundplayer = new Audio('../../assets/stone-grinding.mp3')

  //tablet

  constructor(private animationbuilder: AnimationBuilder) {
    this.boxmovefactory = this.animationbuilder.build(movetocursorhorizontally)   

    this.aboxismoving.pipe(     
      filter(() => isNullOrUndefined(this.currentelement) === false),
    )
    .subscribe((event) => {
      this.animatebox(event)            
    })

    this.aboxismoving.pipe(        
      filter(() => isNullOrUndefined(this.currentelement) === false),
      throttleTime(3000),   
    )
    .subscribe(() => {
      this.blocksoundplayer.play()        
    })
  }

  ngOnInit() {
    this.box1position = new blockstate(box1name)
    this.box2position = new blockstate(box2name)
    this.box3position = new blockstate(box3name)
    this.box4position = new blockstate(box4name)
  }

  onmousepressedbox(event: MouseEvent) {    
    let elementsid = event.currentTarget[idlabel] as string
    
    if(elementsid.indexOf(box1name) !== nooccurrence) {
      this.currentelement = this.box1
      this.currentposition = this.box1position
    }

    else if(elementsid.indexOf(box2name) !== nooccurrence){
      this.currentelement = this.box2
      this.currentposition = this.box2position
    }

    else if(elementsid.indexOf(box3name) !== nooccurrence){
      this.currentelement = this.box3
      this.currentposition = this.box3position
    }

    else if(elementsid.indexOf(box4name) !== nooccurrence){
      this.currentelement = this.box4
      this.currentposition = this.box4position
    }

    if(isNullOrUndefined(this.currentelement) === false) {
      this.makecursorslideicon()
      
    }
  }

  onmousereleasedbox(event: MouseEvent) {
    this.currentelement = null
    this.currentposition = null
    this.resetcursor()
    this.blocksoundplayer.pause()
    console.log('block released.')
  }

  onmousemovedonbox(event: MouseEvent) {
    this.boxmovingsubject.next(event)
  }

  private animatebox = (event: MouseEvent) => {
    let pagetriggered = this.currentposition.addmovement(event.movementY)
    let inputtransformation = `translate(0px, ${this.currentposition.translationy}px)`
    let factory = this.animationbuilder.build(movetocursorhorizontally)

    let animationplayer = factory.create(
      this.currentelement.nativeElement,
      {
        params: {
          inputstyle: inputtransformation
        }
      }
    )
    animationplayer.play()

    if(pagetriggered) {
      this.animatepagetransition()
    }
  }

  private makecursorslideicon() {
    let entirepage = document.documentElement
    entirepage.style.cursor = "ns-resize"
  }

  private resetcursor() {
    let entirepage = document.documentElement
    entirepage.style.cursor = "default"
  }

  private animatepagetransition() {

  }
}
