import { Component, Output, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { fadeout } from './animations/fade'
import { gratingsoundaddress, tabletsoundaddress, drawbridgesoundaddress, aetherpingsoundaddress, effectvolume } from './audio/audio.data';
import { scrolldisabler } from './utility/scrolldisabler';
import { loadstate, LoadingService } from './services/loading.service';
import { Subscription } from 'rxjs';
import {createWorker} from "typed-web-workers"
import { streamresponse } from './services/streaming.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeout]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'portfolio';

  @Output()
  public loadingcomplete: boolean = false

  private sub: Subscription

  private entersound: HTMLAudioElement

  constructor(private load: LoadingService) {
    scrolldisabler.togglescrolling(false)
    this.sub = load.subscribeloadedevent(this.onbackgroundloaded)
    this.entersound = new Audio(aetherpingsoundaddress)
    this.entersound.volume = effectvolume
  }

  ngOnInit(): void {
    window.scrollTo(0, 0)
  }

  public onbackgroundloaded = (state: loadstate) => {
    if(state !== loadstate.done) {
      return
    }
    this.entersound.play()
    this.loadingcomplete = true
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
