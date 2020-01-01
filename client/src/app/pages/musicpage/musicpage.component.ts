import { Component, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import {  pagecomponent, lastpagenumber, page } from '../page.data';
import {  inputopacityname } from 'src/app/animations/animation.data';
import { PagingService } from 'src/app/services/paging.service';
import { SubSink } from 'subsink';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { togglefade } from 'src/app/animations/fade';
import { resetmouse } from 'src/app/animations/mousechanger';
import { contentidentifier } from '../page.data'
import { elementrefargs } from 'src/app/utility/utility.data';
import { LoadingService, loadstate } from 'src/app/services/loading.service';
import { HttpEvent, HttpEventType, HttpUserEvent, HttpResponse } from '@angular/common/http';
import { api } from 'src/environments/api';
import { isnullorundefined } from 'src/app/utility/utilities';
import { MusicService } from 'src/app/services/music.service';

const invisible = "0"
const visible = "1"

@Component({
  selector: 'svg:svg[app-musicpage]',
  templateUrl: './musicpage.component.html',
  styleUrls: ['./musicpage.component.css', '../pages.css']
})
export class MusicpageComponent extends pagecomponent implements AfterViewInit, OnDestroy, page {

  @ViewChild(contentidentifier, elementrefargs)
  content: ElementRef
  private contentsvg: SVGElement

  @ViewChild("pauseicon", elementrefargs)
  pauseicon: ElementRef
  private castpause: SVGElement

  @ViewChild("playicon", elementrefargs)
  playicon: ElementRef
  private castplay: SVGElement

  @ViewChild("iframe1", elementrefargs)
  iframe1: ElementRef

  @ViewChild("iframe2", elementrefargs)
  iframe2: ElementRef

  private pagealreadydisplaying = false
  private sink = new SubSink()

  contentlength = 10

  constructor(paging: PagingService, private streamer: MusicService, private changer: ChangeDetectorRef) {
    super()
    let sub = paging.subscribepagechange(this.onpagechange)
    let sub2 = paging.subscribepagecompletedmove(this.onpagechangecomplete)
    
    this.sink.add(sub)
    this.sink.add(sub2)

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
    this.changer.reattach()
    super.ngAfterViewInit()
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

  public onpause = () => {
    this.changer.detach()
    this.castpause.style.opacity = invisible
    this.castplay.style.opacity = visible
    this.changer.reattach()
    this.streamer.pause()
  }

  public onplay = () => {
    this.changer.detach()
    this.castplay.style.opacity = invisible
    this.castpause.style.opacity = visible    
    this.changer.reattach()
    this.streamer.playrandomdeserttrack()
  }

  public ontoggle = () => {
    if(this.castpause.style.opacity === invisible) {
      this.onplay()
    }

    else {
      this.onpause()
    }
  }

  public onfocuschange = () => {
    if (document.activeElement === this.iframe1.nativeElement ||
      document.activeElement === this.iframe2.nativeElement) {
      this.onpause()
      console.log("iframe click")
    }    
  }

  ngOnDestroy() {
    this.sink.unsubscribe()   
    window.removeEventListener("blur", this.onfocuschange) 
  }
}