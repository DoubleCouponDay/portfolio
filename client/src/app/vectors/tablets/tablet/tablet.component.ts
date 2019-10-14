import { Component, OnInit, Input, Output, Type, ElementRef, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AnimationBuilder, AnimationFactory, AnimationPlayer } from '@angular/animations';
import { tabletdata, tabletname, tablet3initialrotation, tablettranslationposition, flip, resetpoint } from './tablet.data';
import { rotatename, scalename, degreesunit } from 'src/app/animations/styleconstants';
import { rotatetablet90, anglename, flipkick, normalkick, curvename } from 'src/app/animations/rotatetablet';
import { transformelement } from 'src/app/elementtransformer';
import { PagingService } from 'src/app/services/paging.service';
import { inputtimename, rotationtime, rotatetablet90withkick, reset360 } from 'src/app/animations/rotatetablet';

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

  private animation90withkick: AnimationFactory
  private animation90: AnimationFactory
  private winddownanimation: AnimationFactory

  constructor(private animationbuilder: AnimationBuilder, private pager: PagingService, private changer: ChangeDetectorRef) {
    this.animation90withkick = animationbuilder.build(rotatetablet90withkick)
    this.animation90 = animationbuilder.build(rotatetablet90)
    this.winddownanimation = animationbuilder.build(reset360)
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
    let params: any = {}
    let flipangle = currentangle + 90
    let fliptime = rotationtime / 2

    let angle1 = useflipanimation === true ? flipangle : newangle
    let time = useflipanimation === true ? fliptime : rotationtime
    let curve = useflipanimation === true ? flipkick : normalkick
    params[anglename] = angle1
    params[inputtimename] = time
    params[curvename] = curve

    let animationplayer1 = this.animation90withkick.create(this.tabletelement.nativeElement, {
        params: params
    })

    this.changer.detach()    
    animationplayer1.play()    

    animationplayer1.onStart(() => {
      this.maketabletvisible()      
    })

    animationplayer1.onDone(() => {
      if(useflipanimation === true) {
        this.playflipanimation(params, flipangle, newangle, time)
      }

      else {
        this.changer.reattach()
        this.applycorrectvisibility()      
      }
    })
  }

  private playflipanimation(inputparams: any, currentangle: number, newangle: number, a3time: number) {
    let animationplayer2: AnimationPlayer    

    if(currentangle === resetpoint) {
      inputparams[anglename] = 0
      inputparams[inputtimename] = '0'

      animationplayer2 = this.winddownanimation.create(this.tabletelement.nativeElement, {
        params: inputparams
      })
      animationplayer2.play()
    }

    else {
      this.playthirdanimation(inputparams, newangle, a3time)
      return
    }

    animationplayer2.onDone(() => {
      this.playthirdanimation(inputparams, newangle, a3time)
    })
  }

  private playthirdanimation(inputparams: any, newangle: number, time: number) {
    let animationplayer3: AnimationPlayer
    inputparams[anglename] = newangle
    inputparams[inputtimename] = time

    animationplayer3 = this.animation90.create(this.tabletelement.nativeElement, {
      params: inputparams
    })
    animationplayer3.play()

    animationplayer3.onDone(() => {      
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
