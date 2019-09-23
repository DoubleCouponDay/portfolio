import { Component, OnInit } from '@angular/core';
import { page } from '../Page.interface';

@Component({
  selector: 'g[app-hardwarepage]',
  templateUrl: './hardwarepage.component.html',
  styleUrls: ['./hardwarepage.component.css']
})
export class HardwarepageComponent implements OnInit, page {

  constructor() { }

  ngOnInit() {
  }

}
