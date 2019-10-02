import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { scalename, translatename, pixelunit } from 'src/app/animations/styleconstants';
import { nooccurrence } from 'src/app/global.data';
import { minboxtranslation, biggestshadow, maxboxtranslation, smallestshadow, shadowname, boxname, grindingaudiopath, defaultfill, wordname, pathname, boxgroupname } from './blocks.data';
import { AnimationFactory, AnimationBuilder } from '@angular/animations';
import { Subject } from 'rxjs';
import { generatedraggableaudio } from 'src/app/audio/generatedraggableaudio';
import { firstpagenumber, websitespagenumber, softwarepagenumber, lastpagenumber } from 'src/app/pages/page.data';
import { SubSink } from 'subsink';
import { mousehighlighter } from 'src/app/animations/mousehighlighter';
import movetocursorvertically, { resetposition } from 'src/app/animations/movetocursorvertically';
import { transformelement } from 'src/app/elementtranslator';
import { resetmouse, changetodragicon } from 'src/app/animations/mousechanger';
import { isnullorundefined } from 'src/app/utilities';
import { rotationtime } from 'src/app/animations/rotatetablet';
import { mouseservice } from 'src/app/services/mouse.service';
import { PagingService } from 'src/app/services/paging.service';

export abstract class Blockcomponent implements AfterViewInit, OnDestroy {

    protected abstract box: ElementRef = null

    boxgroup: SVGElement

    private castbox: SVGElement 

    protected abstract translationY: number = 0
    protected abstract matchingpagenumber: number = 0

    tabletsmoving: boolean = false
    private buttonheld = false

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

    constructor(private animationbuilder: AnimationBuilder, private _mouseservice: mouseservice, private _pagingservice: PagingService) {
        this.boxmovefactory = animationbuilder.build(movetocursorvertically)   
        this.boxresetfactory = animationbuilder.build(resetposition)
        let sub1 = _mouseservice.subscribemovedevent(this.onmousemoved)
        let sub2 = _mouseservice.subscribereleasedevent(this.onmousereleasedbox)
        let sub3 = _pagingservice.subscribepagechange(this.onpagechanged)
        this.sink.add(sub1)
        this.sink.add(sub2)
        this.sink.add(sub3)
    }    
      
    ngAfterViewInit() {
        this.castbox = <SVGElement>this.box.nativeElement
        transformelement(this.castbox, translatename, `0${pixelunit}, ${this.translationY}${pixelunit}`)
        this.highlighter = new mousehighlighter(defaultfill)
        this.boxgroup = document.querySelector(boxgroupname)
        this.chooseshadow()
    }
    
    private onpagechanged = (newpage: number) => {
      if(newpage === this.matchingpagenumber) {
        return
      }
      this.chosenpage = newpage
      this.animatebox(-maxboxtranslation, true)
    }

    /** returns whether the block is at the threshold of activating a page transition */
    addmovement(value: number): boolean {
        this.translationY += value
        
        if(value === 0) {
            return false
        }

        else if(this.translationY < minboxtranslation) {
            this.translationY = minboxtranslation
            this.setshadow(biggestshadow)
            return false
        }

        else if(this.translationY > maxboxtranslation) {
            this.translationY = maxboxtranslation
            this.setshadow(smallestshadow)
            return true
        }
        this.chooseshadow()
        return false
    }

    protected chooseshadow() {
        let shadownumber = Math.floor(this.translationY / maxboxtranslation * smallestshadow) + 1
        this.setshadow(shadownumber)
    }

    private setshadow(shadownumber: number) {
        let chosenshadow = <SVGElement>document.querySelector(`#${shadowname}${shadownumber}`)
        let nativeboxparts = this.boxgroup.querySelectorAll(`${pathname}`)

        if(chosenshadow === null) {
            throw new Error('shadow is null')
        }
        chosenshadow.style.transform = `${scalename}(1)`        

        nativeboxparts.forEach((currentelement) => {
            if(currentelement .id.indexOf(shadowname) === nooccurrence ||
                currentelement.id !== `${shadowname}${shadownumber}`) { //assuming the shadows are in order
              return
            }
            let htmlelement = <SVGElement>currentelement
            htmlelement.style.transform = `${scalename}(0)`
        })
    }

    onmousepressedbox(event: MouseEvent) {  
        this.buttonheld = true
        this.choosecursor()
    }
  
    private onmousereleasedbox = (event: MouseEvent) => {
      this.buttonheld = false
      this.blocksoundplayer.resetaudio()
      resetmouse()    
    }
  
    private onmousemoved = (event: MouseEvent) => {
      if(this.buttonheld === false ||
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
      
      if(this.buttonheld === false) {
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
      let pagetriggered = this.addmovement(movementy)
      let inputtransformation = `${translatename}(0${pixelunit}, ${this.translationY}${pixelunit})`
  
      let chosenfactory = useresetanimation === true ? this.boxresetfactory : this.boxmovefactory
  
      let animationplayer = chosenfactory.create(
        this.castbox,
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
        this.animatepagetransition()
      })
    }
  
    private makecursorstopsign() {
      this.entirepage.style.cursor = 'not-allowed'
    }
  
    private animatepagetransition() {
      let previouspage = this.chosenpage

      if(this.matchingpagenumber === previouspage) {
        return
      }
      this.chosenpage = this.matchingpagenumber
      this.tabletsmoving = true
      this._pagingservice.emitpagechange(this.chosenpage)            
  
      setTimeout(() => { 
        this.tabletsmoving = false
        this.choosecursor()
      }, 
      rotationtime)
    }
  
    ngOnDestroy() {
      this.sink.unsubscribe()
    }    
}
