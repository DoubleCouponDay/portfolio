import { Component, OnInit, Output, ViewChild, EventEmitter, AfterViewInit, AfterViewChecked } from '@angular/core';
import { environment } from '../../environments/environment'
import { scrolldisabler } from '../utility/scrolldisabler';
import { LoadingService, loadstate } from '../services/loading.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class backgroundcomponent implements OnInit {

  constructor(private load: LoadingService) { 
  }

  ngOnInit(): void {
    let time = 3000
          
    setTimeout(() => {
      this.load.emitloadedevent(loadstate.waitingforpress)      
    }, time)
  }  
}
