import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, Output } from '@angular/core';
import { touchevents } from '../touch/touchevents';
import { LoadingService, loadstate } from '../services/loading.service';
import { Subscription } from 'rxjs';
import { scrolldisabler } from '../utility/scrolldisabler';

import { fadein, fadeout, togglefade } from '../animations/fade';
import { AnimationBuilder, NoopAnimationPlayer, AnimationPlayer, AnimationFactory } from '@angular/animations';
import { inputopacityname, inputtimename } from '../animations/animation.data';
import { smoothtime } from '../animations/movetocursorvertically';
import { aetherpingsoundaddress, musicvolume, effectvolume } from '../audio/audio.data';
import { isAppledevice } from '../utility/utilities';
import { gifball, webpball } from './loadingscreen.data';

const shadowfilter = "url(#57Nu2Y3s56IqsQpTc4EMeWkbexdLrGOS)"
const fixedloadtime = 4000

@Component({
  selector: 'app-loadingscreen',
  templateUrl: './loadingscreen.component.html',
  styleUrls: ['./loadingscreen.component.css'],
  animations: [fadein, fadeout]
})
export class LoadingscreenComponent implements AfterViewInit, OnDestroy {
  private touches: touchevents

  @ViewChild('ballcontainer', {static: true}) ballcontainer: ElementRef

  @ViewChild('circle', {static: true}) circle: ElementRef
  private nativecircle: HTMLElement

  @ViewChild('button', {static: true}) button: ElementRef

  @Output()
  public shouldpress = false

  private fadefactory: AnimationFactory
  private fadeanimator: AnimationPlayer

  public imageaddress: string

  constructor(private loading: LoadingService, animationfactory: AnimationBuilder) {
    this.fadefactory = animationfactory.build(togglefade)    

    setTimeout(() => {this.onloaded(loadstate.waitingforpress)}, fixedloadtime)

    if(isAppledevice()) {
      this.imageaddress = gifball
    }

    else {
      this.imageaddress = webpball
    }
  }

  ngAfterViewInit() {
    this.nativecircle = <HTMLElement>this.circle.nativeElement
    this.touches = new touchevents( //prevents panning past the loading screen
      this.onbuttonup,
      this.donothing,
      this.donothing,
      this.ballcontainer.nativeElement,
      this.circle.nativeElement,
    )
  }

  donothing = (event: MouseEvent) => {}

  onmouseover = (inputevent: Event) => {
    let nativebutton = <HTMLElement>this.button.nativeElement
    nativebutton.style.filter = shadowfilter
  }

  onbuttondown = (inputevent: Event) => {
    let nativebutton = <HTMLElement>this.button.nativeElement //touch event could bypass onbutton down so I duplicate this line
    nativebutton.style.filter = ""
  }

  onbuttonup = (inputevent: Event) => {
    if(this.shouldpress === false) {
      return
    }    
    this.loading.emitloadedevent(loadstate.done)
    scrolldisabler.togglescrolling(true)    
  }

  onloaded = (state: loadstate) => {
    if(state !== loadstate.waitingforpress) {
      return
    }
    this.shouldpress = true

    let inputparams: any = {}
    inputparams[inputopacityname] = 0
    inputparams[inputtimename] = smoothtime

    this.fadeanimator = this.fadefactory.create(this.circle.nativeElement, {
      params: inputparams,
    })
    this.fadeanimator.play()
  }

  onanimationloaded = (input: Event) => {
    this.nativecircle.style.opacity = "1"
  }

  ngOnDestroy() {
    this.touches.dispose()
  }
}
