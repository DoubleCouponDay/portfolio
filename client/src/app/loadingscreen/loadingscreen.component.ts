import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { touchevents } from '../touch/touchevents';

@Component({
  selector: 'app-loadingscreen',
  templateUrl: './loadingscreen.component.html',
  styleUrls: ['./loadingscreen.component.css']
})
export class LoadingscreenComponent implements AfterViewInit {
  private touches: touchevents

  @ViewChild('message', {static: true})
  message: ElementRef

  @ViewChild('ballcontainer', {static: true})
  ballcontainer: ElementRef

  @ViewChild('circle', {static: true})
  circle: ElementRef

  constructor() { }

  ngAfterViewInit() {
    this.touches = new touchevents( //prevents panning past the loading screen
      this.ontouch,
      this.ontouch,
      this.ontouch,
      this.message.nativeElement,
      this.ballcontainer.nativeElement,
      this.circle.nativeElement
    )
  }

  ontouch = (event: MouseEvent) => {

  }
}
