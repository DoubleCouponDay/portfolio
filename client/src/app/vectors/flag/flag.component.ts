import { Component, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef, Output, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { elementrefargs } from 'src/app/utility/utility.data';
import { slidestate, animatetime, gettransformstyle, botstatevalue, topstatevalue, slidedistance } 
  from 'src/app/animations/slide';
import { flagsegment } from './flag.data';
import { AnimationBuilder, AnimationFactory, AnimationPlayer } from '@angular/animations';
import { isNgTemplate } from '@angular/compiler';
import { isnullorundefined } from 'src/app/utility/utilities';
import { inputtimename } from 'src/app/animations/animation.data';

const flaglength = 18
const segmentoffset = 4
const flagclass = "flag-segment"
const leftspacing = 20

@Component({
  selector: 'g[app-flag]',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.css']
})
export class FlagComponent implements OnInit, OnDestroy {

  @ViewChild('cloth', elementrefargs)
  cloth: ElementRef
  private castcloth: HTMLElement

  @Output()
  segmentdata: flagsegment[]

  private playtop: AnimationFactory
  private playbot: AnimationFactory

  constructor(private builder: AnimationBuilder, private changer: ChangeDetectorRef) {    
    this.segmentdata = new Array<flagsegment>(flaglength) 
    this.playbot = builder.build(gettransformstyle(botstatevalue))
    this.playtop = builder.build(gettransformstyle(topstatevalue))
  }

  ngOnInit() {
    this.onanimationinit()
    document.addEventListener("visibilitychange", this.onvisiblitychange)
  }

  private onanimationinit = () => {
    this.initialisesegments()
    this.startanimation()
  }

  private initialisesegments = () => {
    this.changer.detach()
    this.castcloth = <HTMLElement>this.cloth.nativeElement  
    let leftincrement = 0
    let verticalincrement = 0
    let shouldoffsetdown = slidestate.translatingbot

    for(let i = 0; i < this.segmentdata.length; i++) {
      let [newincrement, newdirection] = this.decidefutureoffset(verticalincrement, shouldoffsetdown)
      verticalincrement = newincrement
      shouldoffsetdown = newdirection
      let newelement = this.createflagpart(i, this.castcloth, leftincrement, verticalincrement)

      let newitem: flagsegment = {
        expression: shouldoffsetdown,
        element: newelement,
        animator: null,
        startingoffset: verticalincrement
      }
      this.segmentdata[i] = newitem
      leftincrement += leftspacing      
    }
    this.changer.reattach()
  }  

  private decidefutureoffset = (currentoffset: number, direction: slidestate): [number, slidestate] => {
    let futureincrement = direction === slidestate.translatingbot 
      ? (currentoffset + segmentoffset) 
      : (currentoffset - segmentoffset)
    
    if(futureincrement > slidedistance) {
      direction = slidestate.translatingtop  
      let remainder = futureincrement - slidedistance
      futureincrement = slidedistance - remainder              
    }

    else if(futureincrement < 0) {
      direction = slidestate.translatingbot
      let remainder = Math.abs(futureincrement)
      futureincrement = remainder  
    }
    return [futureincrement, direction]
  }

  private createflagpart = (id: number, parent: HTMLElement, leftpositioning: number, verticalpositioning: number): HTMLElement => {
    let output = document.createElement("div")
    output.style.left = `${leftpositioning}px`
    output.style.transform = `translate(0px, ${verticalpositioning}px)`
    output.classList.add(flagclass)
    output.id = `${id}`
    parent.appendChild(output)
    return output
  }

  private startanimation = () => {
    for(let i = 0; i < this.segmentdata.length; i++) {
      let item = this.segmentdata[i]
      this.animatesegment(item)
    }
  }

  private animatesegment = (subject: flagsegment) => {
    let chosenfactory: AnimationFactory
    let currentposition : number        
    let initialstate = isnullorundefined(subject.animator)
    let willmovetop = subject.expression === slidestate.translatingtop
    let distancetotravel: number

    if(initialstate) {
      currentposition = subject.startingoffset
      distancetotravel = willmovetop
        ? subject.startingoffset
        : slidedistance - currentposition
    }

    else {            
      currentposition = willmovetop ? slidedistance : 0
      subject.expression = willmovetop ? slidestate.translatingbot : slidestate.translatingtop
      distancetotravel = slidedistance
    }

    chosenfactory = willmovetop ? this.playtop : this.playbot
    let time = animatetime / slidedistance * distancetotravel
    let inputparams: any = {}
    inputparams[inputtimename] = time
    subject.animator = chosenfactory.create(subject.element, { params: inputparams })      
    
    subject.animator.onDone(() => {
      this.animatesegment(subject)
    })
    try {
      subject.animator.play()
    }
    
    catch(error) {
      
    }
  }

  private onvisiblitychange = () => {
    if(document.hidden === false) {
      this.onanimationdestroy()
      this.onanimationinit()
    }
  }

  private onanimationdestroy = () => {
    this.changer.detach()

    for(let i = 0; i < this.segmentdata.length; i++) {
      let item = this.segmentdata[i]

      if(isnullorundefined(item.animator) === false) {
        try {
          item.animator.destroy()
        }      
        
        catch(error) {

        }
      }
      this.castcloth.removeChild(item.element)
    }
    this.changer.reattach()
  }

  ngOnDestroy() {
    this.onanimationdestroy()
    document.removeEventListener("visibilitychange", this.onvisiblitychange)
  }
}
