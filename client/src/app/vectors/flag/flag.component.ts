import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { elementrefargs } from 'src/app/utility/utility.data';

const flagsize = 30
const spanname = 'span'


@Component({
  selector: 'g[app-flag]',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.css']
})
/** credit due to: https://codepen.io/html5andblog/pen/yaYEAx */
export class FlagComponent implements AfterViewInit, OnDestroy {

  @ViewChild('cloth', elementrefargs)
  cloth: ElementRef

  tickid: number

  constructor() { }

  ngAfterViewInit() {
    this.startanimation()
  }

  private startanimation() {    
    this.tickid = setInterval(this.movecloth)
  }

  private movecloth = () => {
    let castcloth = <HTMLElement>this.cloth.nativeElement
    let clothparts = castcloth.getElementsByClassName(spanname)

    for(let i = 0; i < clothparts.length; i++) {
      let currentpart = clothparts[i]      
      currentpart.textContent.trim()
      currentpart.innerHTML = ''
      this.addspans(currentpart)      
    }
  }

  private addspans = (currentclothpart: Element) => {
    for(let i = 0; i < flagsize; i++) {
      let newspan = document.createElement(spanname)
      currentclothpart.appendChild(newspan)
    }  
  }

  ngOnDestroy() {
    clearInterval(this.tickid)
  }
}
