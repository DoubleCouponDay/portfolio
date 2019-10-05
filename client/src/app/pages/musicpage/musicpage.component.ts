import { Component,  OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import {  pagecomponent, lastpagenumber, page } from '../page.data';
import {  inputopacityname } from 'src/app/animations/styleconstants';
import { PagingService } from 'src/app/services/paging.service';
import { SubSink } from 'subsink';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { togglefade } from 'src/app/animations/fadeout';
import { resetmouse } from 'src/app/animations/mousechanger';
import { contentidentifier } from '../page.data'

@Component({
  selector: 'svg:svg[app-musicpage]',
  templateUrl: './musicpage.component.html',
  styleUrls: ['./musicpage.component.css', '../portfoliopage/portfoliopage.component.css']
})
export class MusicpageComponent extends pagecomponent implements AfterViewInit, OnDestroy, page {

  @ViewChild(contentidentifier, {static: true})
  content: ElementRef

  private castcontent2: SVGElement

  private pagealreadydisplaying = false
  private sink = new SubSink()

  private animator: AnimationFactory

  contentlength = 0

  constructor(pagingservice: PagingService, builder: AnimationBuilder) {
    super()
    let sub = pagingservice.subscribepagechange(this.onpagechange)
    let sub2 = pagingservice.subscribepagecompletedmove(this.onpagechangecomplete)
    this.sink.add(sub)
    this.sink.add(sub2)
    this.animator = builder.build(togglefade)
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

  private animatecontentfade(state: number) {
    let params: any = {}
    params[inputopacityname] = state

    let animation = this.animator.create(this.castcontent2, {
      params: params
    })

    animation.play()
  }
  
  ngOnDestroy() {
    this.sink.unsubscribe()
  }
}