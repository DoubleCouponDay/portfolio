import { Component, Output, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { fadeout } from './animations/fade'
import { gratingsoundaddress, tabletsoundaddress, drawbridgesoundaddress } from './audio/audio.data';
import { scrolldisabler } from './utility/scrolldisabler';
import { loadstate, LoadingService } from './services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '../normalize.css'],
  animations: [fadeout]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'portfolio';

  @Output()
  public loadingcomplete: boolean = false

  private sound1: HTMLAudioElement
  private sound2: HTMLAudioElement
  private sound3: HTMLAudioElement

  private sub: Subscription

  constructor(private load: LoadingService) {
    scrolldisabler.togglescrolling(false)
    this.sub = load.subscribeloadedevent(this.onbackgroundloaded)
  }

  ngOnInit(): void {
    window.scrollTo(0, 100)
  }

  public onbackgroundloaded = (state: loadstate) => {
    if(state !== loadstate.done) {
      return
    }
    this.loadingcomplete = true
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
