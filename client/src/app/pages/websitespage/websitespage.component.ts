import { Component, OnInit } from '@angular/core';
import { page } from '../Page.interface';

@Component({
  selector: 'svg:svg[app-websitespage]',
  templateUrl: './websitespage.component.html',
  styleUrls: ['./websitespage.component.css']
})
export class websitespageComponent implements OnInit, page {

  constructor() { }

  ngOnInit() {
  }

}
