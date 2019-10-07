import { Component, Output, OnInit } from '@angular/core';
import { fadeout } from './animations/fadeout';
import { disabletouchevents } from './utility/utilities';

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

  constructor()
  {

  }

  ngOnInit(): void {
    window.scroll({
      top: 100,
      behavior: "smooth"
    })
  }

  public onbackgroundloaded() {
      this.loadingcomplete = true
  }
}
