import { Component, OnInit, Output, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class backgroundcomponent implements OnInit, AfterViewInit {

  @Output()
  public backgroundloaded: EventEmitter<number> = new EventEmitter()

  constructor() { 
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    let time = environment.production ? 3000 : 0
          
    setTimeout(() => {
      this.backgroundloaded.emit()
    }, time)
  }  
}
