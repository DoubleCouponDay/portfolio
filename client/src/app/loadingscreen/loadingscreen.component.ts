import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, Output } from '@angular/core';
import { touchevents } from '../touch/touchevents';
import { LoadingService, loadstate } from '../services/loading.service';
import { Subscription } from 'rxjs';
import { scrolldisabler } from '../utility/scrolldisabler';
import { elementrefargs } from '../utility/utility.data';
import { fadein, fadeout } from '../animations/fade';

@Component({
  selector: 'app-loadingscreen',
  templateUrl: './loadingscreen.component.html',
  styleUrls: ['./loadingscreen.component.css'],
  animations: [fadein, fadeout]
})
export class LoadingscreenComponent implements AfterViewInit, OnDestroy {
  private touches: touchevents

  @ViewChild('ballcontainer', elementrefargs)
  ballcontainer: ElementRef

  @ViewChild('circle', elementrefargs)
  circle: ElementRef

  @ViewChild('button', elementrefargs)
  button: ElementRef

  @Output()
  public shouldpress = false

  private sub: Subscription

  constructor(private loading: LoadingService) {
    this.sub = this.loading.subscribeloadedevent(this.onloaded)
  }

  ngAfterViewInit() {
    this.touches = new touchevents( //prevents panning past the loading screen
      this.ontouch,
      this.ontouch,
      this.ontouch,
      this.ballcontainer.nativeElement,
      this.circle.nativeElement
    )
  }

  ontouch = (event: MouseEvent) => {}

  onbuttonpressed = (inputevent: Event) => {
    if(this.shouldpress === false) {
      return
    }
    this.loading.emitloadedevent(loadstate.done)
    scrolldisabler.togglescrolling(true)
  }

  onloaded = (state: loadstate) => {
    if(state !== loadstate.waitingforpress) {
      return
    }
    this.shouldpress = true
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
