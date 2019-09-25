import { Component, OnInit, Input, Output, Type, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { tabletdata, tabletname, tablet3initialrotation } from './tablet.data';
import { rotatename, scalename, degreesunit } from 'src/app/animations/styleconstants';
import { rotatetablet } from 'src/app/animations/rotatetablet';
import { nooccurrence } from 'src/app/global.data';

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
      this.applyrotation(input)          
  }

  @ViewChild(tabletname, {static: true})
  private tabletelement: ElementRef

  private castelement: SVGElement

  @Input()
  initialdata: tabletdata

  private animation: AnimationFactory

  constructor(private animationbuilder: AnimationBuilder, private changer: ChangeDetectorRef) {
    this.animation = animationbuilder.build(rotatetablet)
  }

  ngOnInit() {
    this.initialized = true
    this.castelement = this.tabletelement.nativeElement as SVGElement

    this.castelement.style.transformOrigin = 
      `${this.initialdata.translationposition[0]}% ${this.initialdata.translationposition[1]}%`

    this.replacetransformvalue(rotatename, `${this.rotationfield}${degreesunit}`) //there should be no animation to the initial position
    this.applycorrectvisibility()
  }

  applyrotation(angle: number) {    
    let animationplayer = this.animation.create(this.tabletelement.nativeElement, {
        params: {
            inputtransform: `${rotatename}(${angle}${degreesunit})`
        }
    })    
    animationplayer.play()    

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
      let anyvalueregex = new RegExp(`${key}\\(.+\\)`) //any value one or more times
      let replacement = this.castelement.style.transform.replace(anyvalueregex, newtransform)  
      this.castelement.style.transform = replacement
    }

    else {
      this.castelement.style.transform += newtransform
    }    
    this.changer.detectChanges()
  }
}
