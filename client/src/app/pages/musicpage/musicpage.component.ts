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
import { isnullorundefined } from 'src/app/utility/utilities';
import { MusicService } from 'src/app/services/music2.service';

const playerclass = ".iframe-player"

@Component({
  selector: 'svg:svg[app-musicpage]',
  templateUrl: './musicpage.component.html',
  styleUrls: ['./musicpage.component.css', '../pages.css']
})
export class MusicpageComponent extends pagecomponent implements AfterViewInit, OnDestroy, page {

  @ViewChild(contentidentifier, elementrefargs)
  content: ElementRef

  private castcontent2: SVGElement

  private pagealreadydisplaying = false
  private sink = new SubSink()

  contentlength = 10

  constructor(paging: PagingService, private streamer: MusicService) {
    super()
    let sub = paging.subscribepagechange(this.onpagechange)
    let sub2 = paging.subscribepagecompletedmove(this.onpagechangecomplete)
    
    this.sink.add(sub)
    this.sink.add(sub2)

    streamer.startconnection()
      .then((result) => {
        if(result.outcome === false) {
          return
        }
        streamer.playrandomdeserttrack()
      })
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

  ngOnDestroy() {
    this.sink.unsubscribe()    
  }
}