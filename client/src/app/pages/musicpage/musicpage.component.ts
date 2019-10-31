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
import { MusicService } from 'src/app/services/music.service';
import { LoadingService, loadstate } from 'src/app/services/loading.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'svg:svg[app-musicpage]',
  templateUrl: './musicpage.component.html',
  styleUrls: ['./musicpage.component.css', '../portfoliopage/portfoliopage.component.css']
})
export class MusicpageComponent extends pagecomponent implements AfterViewInit, OnDestroy, page {

  @ViewChild(contentidentifier, elementrefargs)
  content: ElementRef

  private castcontent2: SVGElement

  private pagealreadydisplaying = false
  private sink = new SubSink()

  contentlength = 10

  private _audiocontext: AudioContext
  private _mediastreamtrack: MediaStreamTrack
  private _mediastream: MediaStream
  private _mediastreamsource: MediaStreamAudioSourceNode

  constructor(paging: PagingService, private streamer: MusicService, loading: LoadingService) {
    super()
    let sub = paging.subscribepagechange(this.onpagechange)
    let sub2 = paging.subscribepagecompletedmove(this.onpagechangecomplete)
    let sub3 = loading.subscribeloadedevent(this.onapploaded)
    this.sink.add(sub)
    this.sink.add(sub2)
    this.sink.add(sub3)
  }

  ngAfterViewInit() {
    this.castcontent2 = <SVGElement>this.content.nativeElement
    this.castcontent2.style.opacity = '0'
    super.ngAfterViewInit()
  }

  private onpagechange = (pagenumber: number) => {
    if(pagenumber === lastpagenumber) {
      return
    }
    this.pagealreadydisplaying = false
    this.castcontent2.style.opacity = '0'
  }

  private onpagechangecomplete = (pagenumber: number) => {
    if(this.pagealreadydisplaying === true ||
      pagenumber !== lastpagenumber) {
      return
    }
    this.pagealreadydisplaying = true
    this.castcontent2.style.opacity = '1'
  }

  private onapploaded = (state: loadstate) => {
    if(state !== loadstate.done) {
      return
    }
    this.streamer.getrandomdeserttrack()
      .subscribe((progress: HttpEvent<Blob>) => {
          switch(progress.type) {
            case HttpEventType.DownloadProgress:
              progress.
          }
      })
  }
  
  ngOnDestroy() {
    this.sink.unsubscribe()
  }
}