import { Component } from '@angular/core';
import { mouseservice } from '../services/mouse.service';

@Component({
  selector: 'app-vectors',
  templateUrl: './vectors.component.html',
  styleUrls: ['./vectors.component.css']
})
export class vectorscomponent {

  constructor(private mouseservice: mouseservice) {

  }
  
  onmousereleased(event: MouseEvent) {
    console.log('mouse released')
    this.mouseservice.emitreleasedevent(event)
  }

  onmousemoved(event: MouseEvent) {
    this.mouseservice.emitmousemovedevent(event)
  }
}
