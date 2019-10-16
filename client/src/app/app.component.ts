import { Component, Output, OnInit, AfterContentChecked } from '@angular/core';
import { fadeout } from './animations/fadeout';
import { gratingsoundaddress, tabletsoundaddress, drawbridgesoundaddress } from './audio/audio.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeout]
})
export class AppComponent implements OnInit, AfterContentChecked {
  title = 'portfolio';

  @Output()
  public loadingcomplete: boolean = false

  constructor()
  {

  }

  ngOnInit(): void {
    window.scroll({
      top: 100,
      behavior: "smooth"
    })
  }

  ngAfterContentChecked() {
    this.cachesounds()
  }

  public onbackgroundloaded() {
      this.loadingcomplete = true
  }

  private cachesounds() {
    let sound1 = new Audio(gratingsoundaddress)
    let sound2 = new Audio(tabletsoundaddress)
    let sound3 = new Audio(drawbridgesoundaddress)
  }
}
