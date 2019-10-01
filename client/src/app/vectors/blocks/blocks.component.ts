import { Component, OnInit, ViewChild, ElementRef, Output, Type, OnDestroy, AfterViewInit } from '@angular/core';
import { box1name, box2name, box3name, box4name, grindingaudiopath, boxgroup1name, maxboxtranslation, boxgroup2name, minboxtranslation, boxgroup3name, boxgroup4name, defaultfill, wordname, firstboxnumber, lastboxnumber, secondboxnumber, thirdboxnumber } from './blocks.data';
import { blockstate } from './blockstate';
import { AnimationFactory, AnimationBuilder } from '@angular/animations';
import { Subject } from 'rxjs';
import { generatedraggableaudio } from 'src/app/audio/generatedraggableaudio';
import { firstpagenumber, softwarepagenumber, hardwarepagenumber, totalpagesamount } from 'src/app/pages/page.data';
import { SubSink } from 'subsink';
import { mousehighlighter } from 'src/app/animations/mousehighlighter';
import movetocursorvertically, { resetposition } from 'src/app/animations/movetocursorvertically';
import { transformelement } from 'src/app/elementtranslator';
import { translatename, pixelunit } from 'src/app/animations/styleconstants';
import { nooccurrence } from 'src/app/global.data';
import { resetmouse, changetodragicon } from 'src/app/animations/mousechanger';
import { isnullorundefined } from 'src/app/utilities';
import { rotationtime } from 'src/app/animations/rotatetablet';
import { mouseservice } from 'src/app/services/mouse.service';

@Component({
  selector: 'g[app-blocks]',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent implements AfterViewInit, OnDestroy {
  tabletsmoving: boolean = false

  //boxes
  @ViewChild(box1name, { static: true })
  box1: ElementRef = null
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

  currentbox: ElementRef  
  currentposition: blockstate
  private boxmovefactory: AnimationFactory
  private boxresetfactory: AnimationFactory

  aboxismoving = new Subject<MouseEvent>()
  onboxmoving = this.aboxismoving.asObservable()

  blocksoundplayer = new generatedraggableaudio(grindingaudiopath)

  entirepage: HTMLElement = document.documentElement

  //tablets
  chosenpage: number = firstpagenumber

  private sink = new SubSink()

  private highlighter: mousehighlighter

  constructor(private animationbuilder: AnimationBuilder, private mouseservice: mouseservice) {
    this.boxmovefactory = animationbuilder.build(movetocursorvertically)   
    this.boxresetfactory = animationbuilder.build(resetposition)
    let sub1 = mouseservice.subscribemovedevent(this.onmousemoved)
    let sub2 = mouseservice.subscribereleasedevent(this.onmousereleasedbox)
    this.sink.add(sub1)
    this.sink.add(sub2)
  }

  ngAfterViewInit() {
    this.box1position = new blockstate(boxgroup1name, maxboxtranslation)
    let box1element = <SVGElement>this.box1.nativeElement
    transformelement(box1element, translatename, `0${pixelunit}, ${this.box1position.translationy}${pixelunit}`)

    this.box2position = new blockstate(boxgroup2name, minboxtranslation)
    this.box3position = new blockstate(boxgroup3name, minboxtranslation)
    this.box4position = new blockstate(boxgroup4name, minboxtranslation)
    this.highlighter = new mousehighlighter(defaultfill)
  }

  onmousepressedbox(event: MouseEvent) {  
    let eventelement = <HTMLElement> event.target
    let elementsid = eventelement.id
    
    if(elementsid.indexOf(box1name) !== nooccurrence) {
      this.currentbox = this.box1
      this.currentposition = this.box1position
    }

    else if(elementsid.indexOf(box2name) !== nooccurrence){
      this.currentbox = this.box2
      this.currentposition = this.box2position
    }

    else if(elementsid.indexOf(box3name) !== nooccurrence){
      this.currentbox = this.box3
      this.currentposition = this.box3position
    }

    else if(elementsid.indexOf(box4name) !== nooccurrence){
      this.currentbox = this.box4
      this.currentposition = this.box4position
    }
    this.choosecursor()
  }

  private onmousereleasedbox = (event: MouseEvent) => {
    this.currentbox = null
    this.currentposition = null
    this.blocksoundplayer.resetaudio()
    resetmouse()    
  }

  private onmousemoved = (event: MouseEvent) => {
    if(isnullorundefined(this.currentbox) === true ||
      this.tabletsmoving === true) {
      return
    }    
    this.animatebox(event.movementY)    
    this.blocksoundplayer.maintainaudio()
    this.blocksoundplayer.startaudio()    
    this.aboxismoving.next(event)
  }

  onmouseoverbox(event: MouseEvent) {
    this.choosecursor()
    let element = <SVGElement>event.target
    
    if(element.id.indexOf(wordname) === nooccurrence) {
      this.highlighter.applyhighlight(element)
    }
  }

  onmouseleavebox(event: MouseEvent) {
    this.highlighter.resethighlight()
    
    if(isnullorundefined(this.currentbox) === true) {
      resetmouse()      
    }    
  }

  private choosecursor() {    
    if(this.tabletsmoving === true) {
      this.makecursorstopsign()      
    }

    else {
      changetodragicon()   
    }
  }

  private animatebox = (movementy: number, useresetanimation: boolean = false) => {
    let pagetriggered = this.currentposition.addmovement(movementy)
    let inputtransformation = `${translatename}(0${pixelunit}, ${this.currentposition.translationy}${pixelunit})`
    let elementreference = this.currentbox

    let chosenfactory = useresetanimation === true ? this.boxresetfactory : this.boxmovefactory

    let animationplayer = chosenfactory.create(
      elementreference.nativeElement,
      {
        params: {
          inputstyle: inputtransformation
        }
      }
    )
    animationplayer.play()

    animationplayer.onDone(() => {
      if(pagetriggered === false ||
        this.tabletsmoving === true) {
        return
      }
      this.animatepagetransition(elementreference)
    })
  }

  private makecursorstopsign() {
    this.entirepage.style.cursor = 'not-allowed'
  }

  private animatepagetransition(element: ElementRef) {
    let pressedboxesid = (element.nativeElement as HTMLElement).id
    let previouspage = this.chosenpage

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
    if(this.chosenpage === previouspage) {
      return
    }
    this.tabletsmoving = true
    this.resetnonactivatedblockpositions()

    setTimeout(() => { 
      this.tabletsmoving = false
      this.choosecursor()
    }, 
    rotationtime)
  }

  private resetnonactivatedblockpositions() {
    let savedplace = this.currentbox
    let savedposition = this.currentposition
    
    for(let i = firstboxnumber; i <= lastboxnumber; i++) {
      let iterationbox: ElementRef
      let iterationposition: blockstate

      switch(i) {
        case firstboxnumber:
          iterationbox = this.box1
          iterationposition = this.box1position
          break

        case secondboxnumber:
          iterationbox = this.box2
          iterationposition = this.box2position
          break

        case thirdboxnumber:
          iterationbox = this.box3
          iterationposition = this.box3position
          break

        case lastboxnumber:
          iterationbox = this.box4
          iterationposition = this.box4position
          break

        default:
          throw new Error('could not match a box with an index.')
      }
      
      if(savedplace === iterationbox ||
        iterationposition.translationy === minboxtranslation) {
        continue
      }
      this.currentbox = iterationbox
      this.currentposition = iterationposition
      this.animatebox(-maxboxtranslation, true)
    }    
    this.currentbox = savedplace
    this.currentposition = savedposition
  }

  ngOnDestroy() {
    this.sink.unsubscribe()
  }
}
