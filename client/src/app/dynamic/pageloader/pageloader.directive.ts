import { Directive, ViewContainerRef, Input, ComponentFactoryResolver, OnInit, Type, OnDestroy, ComponentRef, ChangeDetectorRef } from '@angular/core';
import { PortfoliopageComponent } from '../../pages/portfoliopage/portfoliopage.component';
import { pagecomponent } from 'src/app/pages/page.data';

@Directive({
  selector: '[app-pageloader]'
})
export class PageloaderDirective implements OnInit, OnDestroy {

  @Input()
  injectedpage: Type<pagecomponent>

  private component: ComponentRef<pagecomponent>;

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
