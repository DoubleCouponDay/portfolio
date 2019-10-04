import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { scalename, translatename, pixelunit } from 'src/app/animations/styleconstants';
import { nooccurrence } from 'src/app/global.data';
import { minboxtranslation, biggestshadow, maxboxtranslation, smallestshadow, shadowname, boxname, grindingaudiopath, defaultfill, wordname, pathname, boxgroupname, topsidename } from './blocks.data';
import { AnimationFactory, AnimationBuilder } from '@angular/animations';
import { Subject } from 'rxjs';
import { generatedraggableaudio } from 'src/app/audio/generatedraggableaudio';
import { firstpagenumber, websitespagenumber, softwarepagenumber, lastpagenumber } from 'src/app/pages/page.data';
import { SubSink } from 'subsink';
import { mousehighlighter } from 'src/app/animations/mousehighlighter';
import movetocursorvertically, { resetposition, inputtransformname } from 'src/app/animations/movetocursorvertically';
import { transformelement } from 'src/app/elementtranslator';
import { resetmouse, changetodragicon } from 'src/app/animations/mousechanger';
import { isnullorundefined } from 'src/app/utilities';
import { rotationtime } from 'src/app/animations/rotatetablet';
import { mouseservice } from 'src/app/services/mouse.service';
import { PagingService } from 'src/app/services/paging.service';

export abstract class Blockcomponent implements AfterViewInit, OnDestroy {
    @ViewChild(boxname, { static: true })
    box: ElementRef

    @ViewChild(boxgroupname, {static: true}) 
    boxgroup: ElementRef

    @ViewChild(topsidename, {static: true})
    boxtopside: ElementRef
    
    private castbox: SVGElement 
    private castgroup: SVGElement
    private casttopside: SVGElement

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
        this.castgroup = <SVGElement>this.boxgroup.nativeElement
        this.casttopside = <SVGElement>this.boxtopside.nativeElement
        this.chooseshadow()
    }
    
    private onpagechanged = (newpage: number) => {
      if(newpage === this.matchingpagenumber) {
        return
      }
      this.tabletsmoving = true
      this.chosenpage = newpage
      this.animatebox(-maxboxtranslation, true)
      this.setshadow(biggestshadow)
      
      setTimeout(() => { 
        this.tabletsmoving = false
        this.choosecursor()
      }, 
      rotationtime)
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
      let safeposition = this.translationY === 0 ? 1 : this.translationY
      let shadownumber = Math.floor(safeposition / maxboxtranslation * smallestshadow) + 1
      let cielinged = shadownumber > smallestshadow ? smallestshadow : shadownumber
      this.setshadow(cielinged)
    }

    private setshadow(shadownumber: number) {
      if(shadownumber < biggestshadow ||
        shadownumber > smallestshadow) {
          throw new Error('shadow number out of bounds!')
        }
      let chosenshadow = <SVGElement>this.castgroup.querySelector(`#${shadowname}${shadownumber}`)
      let nativeboxparts = this.castgroup.querySelectorAll(`${pathname}`)

      if(chosenshadow === null) {
          throw new Error('shadow is null')
      }
      chosenshadow.style.transform = `${scalename}(1)`        

      nativeboxparts.forEach((currentelement) => {
          if(currentelement.id.indexOf(shadowname) === nooccurrence ||
              currentelement.id === chosenshadow.id) { //assuming the shadows are in order
            return
          }
          let svgcurrent = <SVGElement>currentelement
          svgcurrent.style.transform = `${scalename}(0)`
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
      this.highlighter.applyhighlight(this.casttopside)
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

      let params: any = {}
      params[inputtransformname] = inputtransformation

      let animationplayer = chosenfactory.create(
        this.castbox,
        {
          params: params
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
    }
  
    ngOnDestroy() {
      this.sink.unsubscribe()
    }    
}
