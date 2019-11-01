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
import { HttpEvent, HttpEventType, HttpUserEvent, HttpResponse } from '@angular/common/http';
import { api } from 'src/environments/api';
import { streamresponse } from 'src/app/audio/audio.data';
import { isnullorundefined } from 'src/app/utility/utilities';

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

  // private backgroundmusic: HTMLAudioElement
  private audiocontext: AudioContext
  private audiobuffer: AudioBuffer
  private audiosource: AudioBufferSourceNode

  private apploaded = false
  private musicloadedenough = false
  private musicplaying = false
  private checkmusicintervalid = 0

  constructor(paging: PagingService, private streamer: MusicService, loading: LoadingService) {
    super()
    let sub = paging.subscribepagechange(this.onpagechange)
    let sub2 = paging.subscribepagecompletedmove(this.onpagechangecomplete)
    let sub3 = loading.subscribeloadedevent(this.onapploaded)
    this.sink.add(sub)
    this.sink.add(sub2)
    this.sink.add(sub3)
    this.audiocontext = new AudioContext()

    this.streamer.getrandomdeserttrack()
      .subscribe(this.onmusicdownloaded)
  }

  private onmusicdownloaded = async(response: HttpEvent<ArrayBuffer>) => {
    switch(response.type) {
      case HttpEventType.Response:
        this.audiobuffer = new AudioBuffer({
          length: response.body.byteLength,
          numberOfChannels: 2,
          sampleRate: 44100
        })
        this.audiobuffer = await this.audiocontext.decodeAudioData(response.body, null, this.onerror)

        if(isnullorundefined(this.audiobuffer)) {
          return
        }
        this.audiosource = this.createsourcenode()
          // this.backgroundmusic = new Audio()
          // this.backgroundmusic.volume = 0.5
          // this.backgroundmusic.src = URL.createObjectURL(response.stream)
          // this.backgroundmusic.load()
          // this.backgroundmusic.oncanplay = this.onmusicready
          // this.backgroundmusic.onerror = this.onerror
    }
  }

  private createsourcenode(): AudioBufferSourceNode {
    let output = this.audiocontext.createBufferSource()
    output.buffer = this.audiobuffer
    output.connect(this.audiocontext.destination)
    return output
  }

  // private onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
    private onerror = (error: DOMException) => {
    console.log(error)
  }

  private musicreadytoplay(): boolean {
    return this.musicloadedenough === true && 
    this.apploaded === true && 
    this.musicplaying === false
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
    this.apploaded = true
  }

  private onmusicready = (input: Event) => {
    this.musicloadedenough = true
    this.checkmusicintervalid = window.setInterval(this.playoncondition)
    console.log('music ready')
  }

  private playoncondition = () => {
    if(this.musicreadytoplay()) {
      console.log('music playing')
      // this.backgroundmusic.play()
      this.musicplaying = true
      this.audiosource.start()
      window.clearInterval(this.checkmusicintervalid)
    }
  }
  
  ngOnDestroy() {
    this.sink.unsubscribe()
    window.clearInterval(this.checkmusicintervalid)
  }
}