import { Directive, OnInit, OnDestroy, Input, Type, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

@Directive({
  selector: '[appScrollLoader]'
})
export class ScrollLoaderDirective implements OnInit, OnDestroy {

  @Input()
  shoulddisplay: boolean

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
