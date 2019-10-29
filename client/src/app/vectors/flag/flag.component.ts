import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, Output } from '@angular/core';
import { elementrefargs } from 'src/app/utility/utility.data';
import { slideinfinite, topstatename, swaptime, botstatename, slidestate } from 'src/app/animations/slide';
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

  constructor(changer: ChangeDetectorRef) {    
    this.segmentdata = new Array<flagsegment>()

    for(let i = 0; i < flaglength; i++) {
      let newitem: flagsegment = {
        expression: slidestate.translatedtop,
        intervalid: 0
      }
      this.segmentdata.push(newitem)
    }
  }

  ngAfterViewInit() {
    this.castcloth = <HTMLElement>this.cloth.nativeElement                
    let inputdelay = 0

    for(let i = 0; i < this.castcloth.children.length; i++) {
      this.delaysegmentactivation(inputdelay, i)
      inputdelay += delay
    }
  }

  private delaysegmentactivation = (inputdelay: number, segmentindex: number) => {
    setTimeout(() => {
        this.onsegmentdelayed(segmentindex)
    }, inputdelay)
  }

  private onsegmentdelayed = (segmentindex: number) => {    
    let currentsegment = this.segmentdata[segmentindex]
    let countdown = swaptime

    let framecallback = (timestamp: number) => {    
      countdown--

      if(countdown <= 0) {
        countdown = swaptime
        currentsegment.expression = (currentsegment.expression === slidestate.translatedbot) ? slidestate.translatedtop : slidestate.translatedbot  
      }      
      currentsegment.intervalid = window.requestAnimationFrame(framecallback)      
    }
    currentsegment.intervalid = window.requestAnimationFrame(framecallback)    
  }

  ngOnDestroy() {
    for(let i = 0; i < this.segmentdata.length; i++) {
      let currentsegment = this.segmentdata[i]
      window.cancelAnimationFrame(currentsegment.intervalid)
    }
  }
}
