import { Directive, ViewContainerRef, Input, ComponentFactoryResolver, OnInit, Type, OnDestroy, ComponentRef } from '@angular/core';
import { page } from '../Page.interface';
import { PortfoliopageComponent } from '../portfoliopage/portfoliopage.component';

@Directive({
  selector: '[pageloader]'
})
export class PageloaderDirective implements OnInit, OnDestroy {

  @Input()
  injectedpage: Type<page>

  private component: ComponentRef<page>;

  constructor(private componentloader: ViewContainerRef,
    private componentfactory: ComponentFactoryResolver) {     
  }

  ngOnInit(): void {
    let factory = this.componentfactory.resolveComponentFactory(this.injectedpage)    
    this.component = this.componentloader.createComponent(factory)    
  }

  ngOnDestroy() {
    this.component.destroy()
  }
}
