import { Component, OnInit, Input } from '@angular/core';
import { PortfoliopageComponent } from 'src/app/pages/portfoliopage/portfoliopage.component';

@Component({
  selector: 'g[app-tablet]',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.css']
})
export class TabletComponent implements OnInit {

  @Input()
  injectedcontent: PortfoliopageComponent

  constructor() { }

  ngOnInit() {
  }

}
