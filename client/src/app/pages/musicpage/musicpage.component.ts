import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterContentInit, ChangeDetectorRef, ViewChildren, QueryList, AfterViewChecked, AfterViewInit } from '@angular/core';
import { scrollitemclass, pagecomponent, lastpagenumber } from '../page.data';
import { applytransformtoeachnode } from 'src/app/elementtranslator';
import { translatename, pixelunit, inputopacityname } from 'src/app/animations/styleconstants';
import { PagingService } from 'src/app/services/paging.service';
import { SubSink } from 'subsink';
import { AnimationBuilder, AnimationFactory } from '@angular/animations';
import { togglefade } from 'src/app/animations/fadeout';
import { isnullorundefined } from 'src/app/utilities';
import { rotationtime } from 'src/app/animations/rotatetablet';

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
    this.changer.detectChanges()
  }

  /** no string will default to visible */
  private animatecontentfade(state: number) {
    let params: any = {}
    params[inputopacityname] = state

    console.log(`moving to opacity: ${state}`)

    let animation = this.animator.create(this.castcontent, {
      params: params
    })

    animation.onStart(() => {
      console.log(`started. opacity: ${this.castcontent.style.opacity}`)
      this.changer.detectChanges()
    }) 

    animation.play()

    animation.onDone(() => {
      this.changer.markForCheck()
      this.changer.detectChanges()
      console.log(`ended. opacity: ${this.castcontent.style.opacity}`)      
    })
  }
  
  ngOnDestroy() {
    this.sink.unsubscribe()
  }
}