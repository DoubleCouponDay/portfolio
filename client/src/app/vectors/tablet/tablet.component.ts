import { Component, OnInit, Input, Output, Type } from '@angular/core';
import { PortfoliopageComponent } from 'src/app/pages/portfoliopage/portfoliopage.component';
import { page } from 'src/app/pages/Page.interface';

@Component({
  selector: 'g[app-tablet]',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.css']
})
export class TabletComponent implements OnInit {

  @Input()
  injectedcontent: Type<page>

  constructor() {
    
  }

  ngOnInit() {
    console.log('')
  }

}
