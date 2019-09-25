import { Component, OnInit } from '@angular/core';
import { page } from '../Page.interface';

@Component({
  selector: 'g[app-softwarepage]',
  templateUrl: './softwarepage.component.html',
  styleUrls: ['./softwarepage.component.css']
})
export class softwarepageComponent implements OnInit, page {

  constructor() { }

  ngOnInit() {
  }

}
