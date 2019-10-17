import { Component, Output, OnInit, AfterContentChecked } from '@angular/core';
import { fadeout } from './animations/fadeout';
import { gratingsoundaddress, tabletsoundaddress, drawbridgesoundaddress } from './audio/audio.data';
import { scrolldisabler } from './utility/scrolldisabler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeout]
})
export class AppComponent implements OnInit {
  title = 'portfolio';

  @Output()
  public loadingcomplete: boolean = false

  private sound1: HTMLAudioElement
  private sound2: HTMLAudioElement
  private sound3: HTMLAudioElement

  constructor() {
    scrolldisabler.togglescrolling(false)
  }

  ngOnInit(): void {
    window.scroll({
      top: 100,
      behavior: "smooth"
    })
  }

  public onbackgroundloaded() {
      this.loadingcomplete = true
      this.cachesounds()
  }

  private cachesounds() {
    this.sound1 = new Audio(gratingsoundaddress)
    this.sound1.preload = 'auto'

    this.sound1.onloadend = () => {
      this.sound1 = null
    }
    this.sound2 = new Audio(tabletsoundaddress)
    this.sound2.preload = 'auto'

    this.sound2.onloadend = () => {
      this.sound2 = null
    }
    this.sound3 = new Audio(drawbridgesoundaddress)
    this.sound3.preload = 'auto'

    this.sound3.onloadend = () => {
      this.sound3 = null
    }
  }
}
