import { Component, OnInit, Output, ViewChild, EventEmitter, AfterViewInit, AfterViewChecked, ElementRef } from '@angular/core';
import { environment } from '../../environments/environment'
import { scrolldisabler } from '../utility/scrolldisabler';
import { LoadingService, loadstate } from '../services/loading.service';
import { elementrefargs } from '../utility/utility.data';

const halfloaded = 0.5

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class backgroundcomponent implements OnInit {

  constructor(private load: LoadingService) { 
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
