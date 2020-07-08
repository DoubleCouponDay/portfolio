import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Directive } from '@angular/core';
import { scalename, translatename, pixelunit, inputtimename, inputopacityname } from 'src/app/animations/animation.data';
import { nooccurrence } from 'src/app/global.data';
import { minboxtranslation, biggestshadow, maxboxtranslation, smallestshadow, shadowname, boxname, defaultfill, wordname, pathname, boxgroupname, topsidename } from './blocks.data';
import { AnimationFactory, AnimationBuilder, AnimationPlayer } from '@angular/animations';
import { Subject } from 'rxjs';
import { generatedraggableaudio } from 'src/app/audio/generatedraggableaudio';
import { firstpagenumber, websitespagenumber, softwarepagenumber, lastpagenumber } from 'src/app/pages/page.data';
import { SubSink } from 'subsink';
import { mousehighlighter } from 'src/app/animations/mousehighlighter';
import { movetocursorvertically, resetposition, inputtransformname, smoothtime } from 'src/app/animations/movetocursorvertically';
import { transformelement } from 'src/app/elementtransformer';
import { resetmouse, changetodragicon } from 'src/app/animations/mousechanger';
import { isnullorundefined, ismobile } from 'src/app/utility/utilities';
import { rotationtime } from 'src/app/animations/rotatetablet';
import { mouseservice } from 'src/app/services/mouse.service';
import { PagingService } from 'src/app/services/paging.service';
import { touchevents } from 'src/app/touch/touchevents';
import { fadeout, togglefade } from 'src/app/animations/fade';
import { gratingsoundaddress, effectvolume } from 'src/app/audio/audio.data';
import { elementrefargs } from 'src/app/utility/utility.data';

const shadowcheckinterval = smoothtime / 5 
const shadowfadetime = 300

@Directive()
export abstract class Blockcomponent implements AfterViewInit, OnDestroy {
    @ViewChild(boxname, { static: true })
    box: ElementRef

    @ViewChild(boxgroupname, elementrefargs) 
    boxgroup: ElementRef

    @ViewChild(topsidename, elementrefargs)
    boxtopside: ElementRef

    @ViewChild(`${boxname}${wordname}`, elementrefargs)
    boxword: ElementRef
    
    private castbox: SVGElement 
    private castgroup: SVGElement
    private casttopside: SVGElement
    private castword: SVGElement

    protected abstract translationY: number = 0
    protected abstract matchingpagenumber: number = 0

    tabletsmoving: boolean = false
    private held = false
    protected activated = false
    private touched = false

    private boxmovefactory: AnimationFactory
    private boxresetfactory: AnimationFactory
    private fadefactory: AnimationFactory
  
    blocksoundplayer = new generatedraggableaudio(gratingsoundaddress, effectvolume)
    entirepage: HTMLElement = document.documentElement
    chosenpage: number = firstpagenumber
    private sink = new SubSink()
    private highlighter: mousehighlighter    
    private touches: touchevents

    constructor(private animationbuilder: AnimationBuilder, private _mouseservice: mouseservice, private _pagingservice: PagingService) {
      this.boxmovefactory = animationbuilder.build(movetocursorvertically)   
      this.boxresetfactory = animationbuilder.build(resetposition)
      this.fadefactory = animationbuilder.build(togglefade)

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
        this.castword = <SVGElement>this.boxword.nativeElement
        this.chooseshadow()

        this.touches = new touchevents(
          this.onmousepressedbox,
          this.onmousemoved,
          this.onmousereleasedbox,
          this.casttopside,
          this.castword
        )
    }
    
    private shouldnotmove() {
      return this.held === false ||
      this.tabletsmoving === true ||
      this.activated === true ||
      this.touched === true
    }

    private onpagechanged = (newpage: number) => {
      if(newpage === this.matchingpagenumber) {
        return
      }
      this.activated = false
      this.tabletsmoving = true
      this.chosenpage = newpage
      this.animatebox(-maxboxtranslation, true)
      this.setshadow(biggestshadow)
      this.highlighter.resethighlight()      
      
      setTimeout(() => { 
        this.tabletsmoving = false
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
            return false
        }

        else if(this.translationY >= maxboxtranslation) {
            this.translationY = maxboxtranslation
            return true
        }        
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

      let fadeinparams: any = {}
      fadeinparams[inputopacityname] = '1'
      fadeinparams[inputtimename] = shadowfadetime

      let fadein = this.fadefactory.create(chosenshadow, {
        params: fadeinparams
      })

      fadein.play()

      nativeboxparts.forEach((currentelement) => {
          if(currentelement.id.indexOf(shadowname) === nooccurrence ||
              currentelement.id === chosenshadow.id) { //assuming the shadows are in order
            return
          }
          let currentshadow = <SVGElement>currentelement

          let fadeinparams: any = {}
          fadeinparams[inputopacityname] = '0'
          fadeinparams[inputtimename] = shadowfadetime

          let fadeout = this.fadefactory.create(currentshadow, {
            params: fadeinparams
          })
          fadeout.play()
      })
    }

    onmousepressedbox = (event: MouseEvent) => {  
      this.held = true      
      this.choosecursor()

      if(ismobile() === false ||
        this.shouldnotmove() === true) {
        return
      }      
      this.applytouchedstate()
    }

    private applytouchedstate() {
      this.touched = true
      this.highlighter.applyhighlight(this.casttopside)
      this.animatebox(maxboxtranslation, false, smoothtime)
      this.blocksoundplayer.playaudio(true)    
    }
  
    onmousereleasedbox = (event: MouseEvent) => {
      this.held = false      
      resetmouse()     
      
      if(ismobile()) {
        return
      }
      this.blocksoundplayer.resetaudio()
    }
  
    private onmousemoved = (event: MouseEvent) => {
      if(this.shouldnotmove() === true) {
        return
      }    
      this.animatebox(event.movementY)    
      this.blocksoundplayer.playaudio()    
    }
  
    onmouseoverbox = (event: MouseEvent) => {
      this.choosecursor()
      this.highlighter.applyhighlight(this.casttopside)
    }
  
    onmouseleavebox = (event: MouseEvent) => {
      if(isnullorundefined(event) === false &&
        isnullorundefined(event['target']) === false) {
        this.choosehighlightreset(event)
      }
      
      if(this.held === false) {
        resetmouse()      
      }    
    }

    private choosehighlightreset(event: MouseEvent) {
      let targetelement = <SVGElement>event.target
      let elementisword = targetelement.id.indexOf(wordname) !== nooccurrence

      if(elementisword === false) {
        this.highlighter.resethighlight()
      }
    }
  
    private choosecursor() {    
      if(this.tabletsmoving === true ||
        this.activated === true) {
        this.makecursorstopsign()      
      }
  
      else {
        changetodragicon()   
      }
    }
  
    private animatebox = (movementy: number, useresetanimation: boolean = false, customtime: number = 0) => {
      let pagetriggered = this.addmovement(movementy)      
      let inputtransformation = `${translatename}(0${pixelunit}, ${this.translationY}${pixelunit})`
  
      let chosenfactory = useresetanimation === true ? this.boxresetfactory : this.boxmovefactory

      let params: any = {}
      params[inputtransformname] = inputtransformation
      params[inputtimename] = customtime

      let animationplayer = chosenfactory.create(
        this.castbox,
        {
          params: params
        }
      )
      this.trackanimationstate(animationplayer, pagetriggered)      
    }

    private trackanimationstate = (player: AnimationPlayer, pagetriggered: boolean) => {
      let shadow = 0
      let intervalid = 0

      player.onStart(() => {
        if(ismobile() === false) {          
          return
        } 
        intervalid = window.setInterval(() => {           
          shadow = this.duringmobileanimation(shadow)                    
        },
        shadowcheckinterval)
      })

      player.onDone(() => {
        clearInterval(intervalid)
        this.touched = false

        if(ismobile() === false) {
          this.chooseshadow()
        }
        
        if(pagetriggered === false ||
          this.tabletsmoving === true) {
          return
        }
        this.animatepagetransition()
      })
      player.play()
    }

    private duringmobileanimation = (shadownumber: number) => {
      shadownumber++
      this.setshadow(shadownumber)
      return shadownumber
    }
  
    protected makecursorstopsign() {
      this.entirepage.style.cursor = 'not-allowed'
    }
  
    private animatepagetransition() {
      if(this.activated === true) {
        return
      }
      this.chosenpage = this.matchingpagenumber
      this.tabletsmoving = true
      this.activated = true
      this._pagingservice.emitpagechange(this.chosenpage)            
    }
  
    ngOnDestroy() {
      this.sink.unsubscribe()
      this.touches.ngOnDestroy()
    }    
}
