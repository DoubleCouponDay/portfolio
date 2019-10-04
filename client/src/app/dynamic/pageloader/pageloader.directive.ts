import { Directive, ViewContainerRef, Input, ComponentFactoryResolver, OnInit, Type, OnDestroy, ComponentRef, ChangeDetectorRef } from '@angular/core';
import { page } from 'src/app/pages/page.data';

@Directive({
  selector: '[app-pageloader]'
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
