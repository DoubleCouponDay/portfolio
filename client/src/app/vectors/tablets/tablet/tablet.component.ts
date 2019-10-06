import { Component, OnInit, Input, Output, Type, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { tabletdata, tabletname, tablet3initialrotation, tablettranslationposition, flip } from './tablet.data';
import { rotatename, scalename, degreesunit } from 'src/app/animations/styleconstants';
import { rotatetablet90, angle1name, rotatetablet180, inputtimename, rotationtime, angle2name } from 'src/app/animations/rotatetablet';
import { nooccurrence } from 'src/app/global.data';
import { transformelement } from 'src/app/elementtranslator';
import { PagingService } from 'src/app/services/paging.service';
import { inputtransformname } from 'src/app/animations/movetocursorvertically';

@Component({
  selector: 'g[app-tablet]',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabletComponent implements OnInit {
  private currentrotationfield: number = 0
  private initialized: boolean = false

  public get currentrotation() { return this.currentrotationfield }

  @Input()
  public set currentrotation(input: number) {
    let difference = Math.abs(input - this.currentrotationfield)
    let shoulduseflip = difference === flip
    let currentangle = this.currentrotationfield
    this.currentrotationfield = input

    if(this.initialized === false) {
      return
    }

    setTimeout(() => {
      this.applyrotation(currentangle, input, shoulduseflip)
    })
  }

  @ViewChild(tabletname, {static: true})
  private tabletelement: ElementRef

  private castelement: SVGElement

  @Input()
  initialdata: tabletdata

  private animation90: AnimationFactory
  private animation180: AnimationFactory

  constructor(private animationbuilder: AnimationBuilder, private pager: PagingService, private changer: ChangeDetectorRef) {
    this.animation90 = animationbuilder.build(rotatetablet90)
    this.animation180 = animationbuilder.build(rotatetablet180)
  }

  ngOnInit() {
    this.initialized = true
    this.castelement = <SVGElement>this.tabletelement.nativeElement

    this.castelement.style.transformOrigin = 
      `${tablettranslationposition[0]}% ${tablettranslationposition[1]}%`

    transformelement(this.castelement, rotatename, `${this.currentrotationfield}${degreesunit}`) //there should be no animation to the initial position
    this.applycorrectvisibility()
  }

  private applyrotation(currentangle: number, newangle: number, useflipanimation = false) {    
    let chosenanimation = useflipanimation === true ? this.animation180 : this.animation90

    let params: any = {}
    let flipangle = currentangle + 90
    let fliptime = rotationtime / 2
    params[angle1name] = useflipanimation === true ? flipangle : this.currentrotationfield
    params[inputtimename] = useflipanimation === true ? fliptime : rotationtime

    if(useflipanimation === true) {
      params[angle2name] = newangle
    } 

    let animationplayer = chosenanimation.create(this.tabletelement.nativeElement, {
        params: params
    })
    this.changer.detach()    
    animationplayer.play()    

    animationplayer.onStart(() => {
      this.maketabletvisible()      
    })

    animationplayer.onDone(() => {
      this.changer.reattach()
      this.applycorrectvisibility()      
    })
  }

  private maketabletvisible = () => {
    transformelement(this.castelement, scalename, "1")
  }

  private applycorrectvisibility = () => {
    if(this.currentrotationfield === tablet3initialrotation) {
      transformelement(this.castelement, scalename, "0")
    }

    else {
      transformelement(this.castelement, scalename, "1")
    }
  }


}
