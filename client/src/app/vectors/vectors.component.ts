import { Component, OnInit, ViewChild, ElementRef, Output, Type } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { idlabel, maxboxtranslation, minboxtranslation, boxgroupname, firstboxnumber, secondboxnumber, thirdboxnumber, fourthboxnumber, box1name, box2name, box3name, box4name, boxgroup1name, boxgroup3name, boxgroup4name, boxgroup2name } from './blocks/blocks.data';
import movetocursorhorizontally from '../animations/movetocursorhorizontally';
import { AnimationBuilder, AnimationFactory, animation, animate, style } from '@angular/animations';
import { of, Observable, Subscriber, observable, Subject } from 'rxjs';
import { throttleTime, filter, map, debounceTime, throttle } from 'rxjs/operators'
import { blockstate } from './blocks/blockstate';
import { firstpagenumber, softwarepagenumber, hardwarepagenumber, totalpagesamount } from '../pages/pageconstants';
import { nooccurrence } from '../global.data';
import { rotationtime } from '../animations/rotatetablet';
import { translatename, pixelunit } from '../animations/styleconstants';

@Component({
  selector: 'app-vectors',
  templateUrl: './vectors.component.html',
  styleUrls: ['./vectors.component.css']
})
export class vectorscomponent implements OnInit {
  tabletsmoving: boolean = false

  //boxes
  @ViewChild(box1name, { static: true })
  box1: ElementRef  
  private box1position: blockstate

  @ViewChild(box2name, { static: true })
  box2: ElementRef

  private box2position: blockstate

  @ViewChild(box3name, { static: true })
  box3: ElementRef
  private box3position: blockstate


  @ViewChild(box4name, { static: true })
  box4: ElementRef
  private box4position: blockstate

  currentelement: ElementRef  
  currentposition: blockstate
  boxmovefactory: AnimationFactory

  boxmovingsubject = new Subject<MouseEvent>()
  aboxismoving = this.boxmovingsubject.asObservable()

  blocksoundplayer = new Audio('../../assets/stone-grinding.mp3')

  //tablets
  chosenpage: number = firstpagenumber

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
    this.box1position = new blockstate(boxgroup1name, maxboxtranslation)
    let box1element = (this.box1.nativeElement as HTMLElement)
    box1element.style.transform = `translate(0px, ${this.box1position.translationy}px)`

    this.box2position = new blockstate(boxgroup2name, minboxtranslation)
    this.box3position = new blockstate(boxgroup3name, minboxtranslation)
    this.box4position = new blockstate(boxgroup4name, minboxtranslation)
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
  }

  onmousemovedonbox(event: MouseEvent) {
    this.boxmovingsubject.next(event)
  }

  private animatebox = (event: MouseEvent) => {
    let pagetriggered = this.currentposition.addmovement(event.movementY)
    let inputtransformation = `${translatename}(0${pixelunit}, ${this.currentposition.translationy}${pixelunit})`
    let factory = this.animationbuilder.build(movetocursorhorizontally)
    let elementreference = this.currentelement

    let animationplayer = factory.create(
      elementreference.nativeElement,
      {
        params: {
          inputstyle: inputtransformation
        }
      }
    )
    animationplayer.play()

    animationplayer.onDone(() => {
      if(pagetriggered === true &&
        this.tabletsmoving === false) {
        this.animatepagetransition(elementreference)
      }
    })
  }

  private makecursorslideicon() {
    let entirepage = document.documentElement
    entirepage.style.cursor = "ns-resize"
  }

  private resetcursor() {
    let entirepage = document.documentElement
    entirepage.style.cursor = "default"
  }

  private animatepagetransition(element: ElementRef) {
    let pressedboxesid = (element.nativeElement as HTMLElement).id

    switch(pressedboxesid) {
      case box1name:
        this.chosenpage = firstpagenumber
        break

      case box2name:
        this.chosenpage = softwarepagenumber
        break

      case box3name:
        this.chosenpage = hardwarepagenumber
        break

      case box4name: 
        this.chosenpage = totalpagesamount
        break

      default:
          throw new Error("pressed box could not be matched!")
    }
    this.tabletsmoving = true

    setTimeout(() => { this.tabletsmoving = false}, rotationtime)
  }
}
