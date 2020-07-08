import { Component, OnInit, Output, ViewChild, EventEmitter, AfterViewInit, AfterViewChecked, ElementRef } from '@angular/core';
import { LoadingService, loadstate } from '../services/loading.service';

import { isAppledevice } from '../utility/utilities';
import { pngbackground, webpbackground } from './background.data';

const halfloaded = 0.5

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class backgroundcomponent implements OnInit {

  public imageaddress: string

  constructor(private load: LoadingService) { 
    if(isAppledevice()) {
      this.imageaddress = pngbackground
    }

    else {
      this.imageaddress = webpbackground
    }
  }

  ngOnInit(): void {
  }  

  onimageloaded = (event: Event) => {
    this.load.emitloadedevent(loadstate.waitingforpress)      
  }

  onloadprogress = (event: Event) => {
    let castevent = <ProgressEvent>event

    if(castevent.loaded / castevent.total >= halfloaded) {
      this.load.emitloadedevent(loadstate.waitingforpress)
    }
  }
}
