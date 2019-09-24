import { Component, OnInit } from '@angular/core';
import { page } from '../Page.interface';

@Component({
  selector: 'svg:svg[app-softwarepage]',
  templateUrl: './softwarepage.component.html',
  styleUrls: ['./softwarepage.component.css']
})
export class SoftwarepageComponent implements OnInit, page {

  constructor() { }

  ngOnInit() {
  }

}
