import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, Output } from '@angular/core';
import { elementrefargs } from 'src/app/utility/utility.data';
import { slideinfinite, topstatename, swaptime, botstatename, slidestate, animatetime } from 'src/app/animations/slide';
import { flagsegment } from './flag.data';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';

const delay = 600
const flaglength = 18

@Component({
  selector: 'g[app-flag]',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.css'],
  animations: [slideinfinite]
})
export class FlagComponent implements AfterViewInit, OnDestroy {

  @ViewChild('cloth', elementrefargs)
  cloth: ElementRef
  private castcloth: HTMLElement

  @Output()
  segmentdata: flagsegment[]

  constructor() {    
    this.segmentdata = new Array<flagsegment>(flaglength) 

    for(let i = 0; i < flaglength; i++) {
      let newitem: flagsegment = {
        expression: slidestate.translatedtop,
        intervalid: 0
      }
      this.segmentdata[i] = newitem
    }
  }

  ngAfterViewInit() {
    this.delayanimationsteps()
  }

  private delayanimationsteps = () => {
    this.castcloth = <HTMLElement>this.cloth.nativeElement                
    let inputdelay = 0

    for(let i = 0; i < this.castcloth.children.length; i++) {
      let currentsegment = this.segmentdata[i]  

      setTimeout(() => {      
          this.intervalsegmentactivation(currentsegment)
      }, inputdelay)

      inputdelay += delay
    }    
  }

  private intervalsegmentactivation = (currentsegment: flagsegment) => {
    currentsegment.intervalid = window.setInterval(() => {
      currentsegment.expression = this.getcurrentsegmentexpression(currentsegment)
    }, animatetime)
  }

  private getcurrentsegmentexpression(currentsegment: flagsegment) {
    return currentsegment.expression === slidestate.translatedbot ? slidestate.translatedtop : slidestate.translatedbot
  }

  ngOnDestroy() {
    for(let i = 0; i < this.segmentdata.length; i++) {
      let currentsegment = this.segmentdata[i]
      window.clearInterval(currentsegment.intervalid)
    }
  }
}
