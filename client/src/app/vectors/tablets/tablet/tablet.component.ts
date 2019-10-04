import { Component, OnInit, Input, Output, Type, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { tabletdata, tabletname, tablet3initialrotation, tablettranslationposition } from './tablet.data';
import { rotatename, scalename, degreesunit } from 'src/app/animations/styleconstants';
import { rotatetablet } from 'src/app/animations/rotatetablet';
import { nooccurrence } from 'src/app/global.data';
import { transformelement } from 'src/app/elementtranslator';
import { PagingService } from 'src/app/services/paging.service';

@Component({
  selector: 'g[app-tablet]',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.css']
})
export class TabletComponent implements OnInit {
  private rotationfield: number = 0
  private initialized: boolean = false

  @Input()
  public set currentrotation(input: number) {
      if(input > 360) {
          throw new Error('angle cannot be greater than 360')
      }

      else if(input < 0) {
          throw new Error('angle cannot be less than -360')
      }

      this.rotationfield = input

      if(this.initialized === false) {
        return
      }
      setTimeout(() => {
        this.applyrotation(input)
      })
  }

  @ViewChild(tabletname, {static: true})
  private tabletelement: ElementRef

  private castelement: SVGElement

  @Input()
  initialdata: tabletdata

  private animation: AnimationFactory

  constructor(private animationbuilder: AnimationBuilder, private pager: PagingService) {
    this.animation = animationbuilder.build(rotatetablet)
  }

  ngOnInit() {
    this.initialized = true
    this.castelement = <SVGElement>this.tabletelement.nativeElement

    this.castelement.style.transformOrigin = 
      `${tablettranslationposition[0]}% ${tablettranslationposition[1]}%`

    transformelement(this.castelement, rotatename, `${this.rotationfield}${degreesunit}`) //there should be no animation to the initial position
    this.applycorrectvisibility()
  }

  private applyrotation(angle: number) {    
    let animationplayer = this.animation.create(this.tabletelement.nativeElement, {
        params: {
            inputtransform: `${rotatename}(${angle}${degreesunit})`
        }
    })    
    animationplayer.play()    

    animationplayer.onStart(() => {
      this.maketabletvisible()
    })

    animationplayer.onDone(() => {
      this.applycorrectvisibility()      
    })
  }

  private maketabletvisible = () => {
    transformelement(this.castelement, scalename, "1")
  }

  private applycorrectvisibility = () => {
    if(this.rotationfield === tablet3initialrotation) {
      transformelement(this.castelement, scalename, "0")
    }

    else {
      transformelement(this.castelement, scalename, "1")
    }
  }


}
