import { Component,  OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import {  pagecomponent, lastpagenumber } from '../page.data';
import {  inputopacityname } from 'src/app/animations/styleconstants';
import { PagingService } from 'src/app/services/paging.service';
import { SubSink } from 'subsink';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { togglefade } from 'src/app/animations/fadeout';
import { resetmouse } from 'src/app/animations/mousechanger';

const contentidentifier = 'content'

@Component({
  selector: 'svg:svg[app-musicpage]',
  templateUrl: './musicpage.component.html',
  styleUrls: ['./musicpage.component.css', '../portfoliopage/portfoliopage.component.css']
})
export class MusicpageComponent extends pagecomponent implements AfterViewInit, OnDestroy {

  @ViewChild(contentidentifier, {static: true})
  content: ElementRef

  private castcontent: SVGElement

  private pagealreadydisplaying = false
  private sink = new SubSink()

  private animator: AnimationFactory

  constructor(private pagingservice: PagingService, private builder: AnimationBuilder, private changer: ChangeDetectorRef) {
    super()
    let sub = pagingservice.subscribepagechange(this.onpagechange)
    let sub2 = pagingservice.subscribepagecompletedmove(this.onpagechangecomplete)
    this.sink.add(sub)
    this.sink.add(sub2)
    this.animator = builder.build(togglefade)
  }

  ngAfterViewInit() {
    this.castcontent = <SVGElement>this.content.nativeElement
    this.castcontent.style.opacity = '0'
  }

  private onpagechange = (pagenumber: number) => {
    if(pagenumber === lastpagenumber) {
      return
    }
    this.pagealreadydisplaying = false
    this.animatecontentfade(0)
  }

  private onpagechangecomplete = (pagenumber: number) => {
    if(this.pagealreadydisplaying === true ||
      pagenumber !== lastpagenumber) {
      return
    }
    this.pagealreadydisplaying = true
    this.animatecontentfade(1)
  }

  private animatecontentfade(state: number) {
    let params: any = {}
    params[inputopacityname] = state

    let animation = this.animator.create(this.castcontent, {
      params: params
    })

    animation.onDone(() => {
      resetmouse()
      this.changer.markForCheck()
    })

    animation.play()
  }
  
  ngOnDestroy() {
    this.sink.unsubscribe()
  }
}