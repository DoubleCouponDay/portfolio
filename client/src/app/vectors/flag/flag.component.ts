import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef, Output } from '@angular/core';
import { elementrefargs } from 'src/app/utility/utility.data';
import { slideinfinite, topstatename, slidetime, botstatename } from 'src/app/animations/slide';

const flagsize = 18
const leftpad = 20

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
  initiateslide = botstatename

  private intervalid: number

  constructor(private changer: ChangeDetectorRef) {
    this.intervalid = window.setInterval(() => {
      this.initiateslide = (this.initiateslide === topstatename) ? botstatename : topstatename      
    }, slidetime)
  }

  ngAfterViewInit() {
    this.castcloth = <HTMLElement>this.cloth.nativeElement                
  }

  ngOnDestroy() {
    window.clearInterval(this.intervalid)
  }
}
