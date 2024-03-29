import { Component, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import {  abstractpage, lastpagenumber, page } from '../page.data';
import {  inputopacityname } from 'src/app/animations/animation.data';
import { PagingService } from 'src/app/services/paging.service';
import { SubSink } from 'subsink';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { togglefade } from 'src/app/animations/fade';
import { resetmouse } from 'src/app/animations/mousechanger';
import { contentidentifier } from '../page.data'

import { LoadingService, loadstate } from 'src/app/services/loading.service';
import { HttpEvent, HttpEventType, HttpUserEvent, HttpResponse } from '@angular/common/http';
import { api } from 'src/environments/api';
import { isnullorundefined } from 'src/app/utility/utilities';
import { MusicService } from 'src/app/services/music.service';
import { Observable, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { mouseservice } from 'src/app/services/mouse.service';
import { mousehighlighter } from 'src/app/animations/mousehighlighter';

const invisible = "0"
const visible = "1"
const onesecond = 1000
const buttonshadow = "url(#suoiqhvPQZSdJZ3YtSW7dYzCD3zhehFc)"

@Component({
  selector: 'svg:svg[app-musicpage]',
  templateUrl: './musicpage.component.html',
  styleUrls: ['./musicpage.component.css', '../pages.css']
})
export class MusicpageComponent extends abstractpage implements AfterViewInit, OnDestroy, page {

  @ViewChild(contentidentifier, {static: true})
  content: ElementRef
  private contentsvg: SVGElement

  @ViewChild("pauseicon", {static: true})
  pauseicon: ElementRef
  private castpause: SVGElement

  @ViewChild("playicon", {static: true})
  playicon: ElementRef
  private castplay: SVGElement

  @ViewChild("buttonfilter", {static: true})
  buttonfilter: ElementRef
  private castfilter: SVGElement

  @ViewChild("button", {static: true})
  button: ElementRef  
  private castbutton: SVGElement

  private pagealreadydisplaying = false
  private sink = new SubSink()

  contentlength = 10

  private toggledsubject = new Subject<void>()
  private wastoggled = this.toggledsubject.asObservable()  

  private highlighter: mousehighlighter

  constructor(paging: PagingService, private streamer: MusicService, private changer: ChangeDetectorRef) {
    super()
    let sub = paging.subscribepagechange(this.onpagechange)
    let sub2 = paging.subscribepagecompletedmove(this.onpagechangecomplete)

    let sub3 = this.wastoggled.pipe(throttleTime(onesecond))
      .subscribe(this.throttledtoggle)
    
    this.sink.add(sub)
    this.sink.add(sub2)
    this.sink.add(sub3)

    streamer.startconnection()
      .then(() => {
        streamer.playrandomdeserttrack()
      })    
  }

  ngAfterViewInit() {
    window.addEventListener('blur', this.onfocuschange)

    this.changer.detach()
    this.contentsvg = <SVGElement>this.content.nativeElement
    this.contentsvg.style.opacity = invisible

    this.castplay = <SVGElement>this.playicon.nativeElement
    this.castplay.style.opacity = invisible

    this.castpause = <SVGElement>this.pauseicon.nativeElement
    this.castpause.style.opacity = visible

    this.castfilter = <SVGElement>this.buttonfilter.nativeElement
    this.castfilter.style.filter = buttonshadow

    this.castbutton = <SVGElement>this.button.nativeElement
    this.highlighter = new mousehighlighter(this.castbutton.style.fill)
    this.streamer.songfinished.subscribe(this.onpause)

    this.changer.reattach()
    super.ngAfterViewInit()
  }

  public onmouseover = () => {
    this.highlighter.applyhighlight(this.castbutton)
  }

  public onmouseleave = () => {
    this.highlighter.resethighlight()
  }

  private onpagechange = (pagenumber: number) => {
    if(pagenumber === lastpagenumber) {
      return
    }
    this.pagealreadydisplaying = false
    this.contentsvg.style.opacity = invisible
  }

  private onpagechangecomplete = (pagenumber: number) => {
    if(this.pagealreadydisplaying === true ||
      pagenumber !== lastpagenumber) {
      return
    }
    this.pagealreadydisplaying = true
    this.contentsvg.style.opacity = visible
  }

  public ontoggle = () => this.toggledsubject.next()

  private onpause = () => {
    this.changer.detach()
    this.castpause.style.opacity = invisible
    this.castplay.style.opacity = visible
    this.changer.reattach()
    this.streamer.pause()
  }

  private onplay = () => {
    this.changer.detach()
    this.castpause.style.opacity = visible   
    this.castplay.style.opacity = invisible     
    this.changer.reattach()
    this.streamer.restart()
  }

  private throttledtoggle = () => {
    this.castfilter.style.filter = ""

    if(this.castpause.style.opacity === invisible) {
      this.onplay()
    }

    else {
      this.onpause()
    }
    setTimeout(() => this.castfilter.style.filter = buttonshadow, onesecond)
  }

  public onfocuschange = () => {
    if (document.activeElement.tagName === "IFRAME") {
      this.onpause()
    }    
  }

  ngOnDestroy() {
    this.sink.unsubscribe()   
    window.removeEventListener("blur", this.onfocuschange) 
  }
}