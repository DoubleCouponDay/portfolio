import { Component, OnInit, NgModule } from '@angular/core';
import { page } from '../Page.interface';

@Component({
  selector: 'svg:svg[app-portfoliopage]',
  templateUrl: './portfoliopage.component.html',
  styleUrls: ['./portfoliopage.component.css']
})
export class PortfoliopageComponent implements OnInit, page {

  constructor() { }

  ngOnInit() {
  }

}
