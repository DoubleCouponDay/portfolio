import { Component, OnInit, Input, Output, Type, ElementRef, ViewChild } from '@angular/core';
import { PortfoliopageComponent } from 'src/app/pages/portfoliopage/portfoliopage.component';
import { page } from 'src/app/pages/Page.interface';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { tabletdata, tabletname, tablet3initialrotation } from './tablet.data';
import { rotatename, scalename } from 'src/app/animations/styleconstants';
import { rotatetablet } from 'src/app/animations/rotatetablet';
import * as Snap from 'snapsvg'
import { nooccurrence } from 'src/app/global.data';

@Component({
  selector: 'g[app-tablet]',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.css']
})
export class TabletComponent implements OnInit {
  private rotationfield: number = -1
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

      if(this.initialized === true) {
        this.applyrotation(input)
      }
      
  }

  translationposition: [number, number]
  page: Type<page>  

  @ViewChild(tabletname, {static: true})
  private tabletelement: ElementRef

  private castelement: SVGElement

  @Input()
  initialdata: tabletdata

  private animation: AnimationFactory

  constructor(private animationbuilder: AnimationBuilder) {
    this.animation = animationbuilder.build(rotatetablet)
  }

  ngOnInit() {
    this.initialized = true
    this.castelement = (this.tabletelement.nativeElement as SVGElement)

    this.castelement.style.transformOrigin = 
      `${this.initialdata.translationposition[0]}% ${this.initialdata.translationposition[1]}%`

    let initialrotation = `${rotatename}(${this.rotationfield}deg)` //there should be no animation to the initial position
    this.castelement.style.transform = initialrotation
    this.applycorrectvisibility()
  }

  applyrotation(angle: number) {    
    let animationplayer = this.animation.create(this.tabletelement.nativeElement, {
        params: {
            inputtransform: `${rotatename}(${this.rotationfield}deg)`
        }
    })    
    animationplayer.play()
    let gearssound = new Audio('../../../../assets/drawbridge.mp3')
    gearssound.play()

    animationplayer.onStart(() => {
      this.maketabletvisible()
    })

    animationplayer.onDone(this.applycorrectvisibility)
  }

  private maketabletvisible = () => {
    this.replacetransformvalue(scalename, "1")
  }

  private applycorrectvisibility = () => {
    if(this.rotationfield === tablet3initialrotation) {
      this.replacetransformvalue(scalename, "0")
    }

    else {
      this.replacetransformvalue(scalename, "1")
    }
  }

  private replacetransformvalue(key: string, value: string) {
    let newtransform = `${key}(${value})`
    if(this.castelement.style.transform.indexOf(key) !== nooccurrence) {
      this.castelement.style.transform.replace(`${key}(*)`, newtransform)  
    }

    else {
      this.castelement.style.transform += newtransform
    }   
  }
}
