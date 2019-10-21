import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, Output } from '@angular/core';
import { elementrefargs } from 'src/app/utility/utility.data';
import { slideinfinite, topstatename, slidetime, botstatename, slidestate } from 'src/app/animations/slide';
import { flagsegment } from './flag.data';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';

const delay = 300
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
    // changer.detach()

    for(let i = 0; i < flaglength; i++) {
      let newitem: flagsegment = {
        expression: slidestate.translatedtop,
        intervalid: 0
      }
      this.segmentdata.push(newitem)
      // changer.markForCheck()
    }
    // changer.reattach()
    // changer.detectChanges()
  }

  ngAfterViewInit() {
    this.castcloth = <HTMLElement>this.cloth.nativeElement                
    let stagger = 0

    for(let i = 0; i < this.castcloth.children.length; i++) {
      this.delaysegmentactivation(stagger, i)
      stagger += delay
    }
  }

  private delaysegmentactivation = (delay: number, segmentindex: number) => {
    setTimeout(() => {
      this.onsegmentdelayed(segmentindex)
    }, delay)
  }

  private onsegmentdelayed = (segmentindex: number) => {    
    let currentsegment = this.segmentdata[segmentindex]

    currentsegment.intervalid = window.setInterval(() => {      
      currentsegment.expression = (currentsegment.expression === slidestate.translatedbot) ? slidestate.translatedtop : slidestate.translatedbot
    }, slidetime)
  }

  ngOnDestroy() {
    for(let i = 0; i < this.segmentdata.length; i++) {
      let currentsegment = this.segmentdata[i]
      window.clearInterval(currentsegment.intervalid)
    }
  }
}
