import { Component, OnInit } from '@angular/core';
import { page } from '../Page.interface';

@Component({
  selector: 'app-musicpage',
  templateUrl: './musicpage.component.html',
  styleUrls: ['./musicpage.component.css']
})
export class MusicpageComponent implements OnInit, page {

  constructor() { }

  ngOnInit() {
  }

}
