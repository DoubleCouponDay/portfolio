import { Component, OnInit, Output, ViewChild, EventEmitter, AfterViewInit, AfterViewChecked, ElementRef } from '@angular/core';
import { environment } from '../../environments/environment'
import { scrolldisabler } from '../utility/scrolldisabler';
import { LoadingService, loadstate } from '../services/loading.service';
import { elementrefargs } from '../utility/utility.data';
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

  onimageloaded = (event: ProgressEvent) => {
    this.load.emitloadedevent(loadstate.waitingforpress)      
  }

  onloadprogress = (event: ProgressEvent) => {
    if(event.loaded / event.total >= halfloaded) {
      this.load.emitloadedevent(loadstate.waitingforpress)
    }
  }
}
