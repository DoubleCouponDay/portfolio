import { applytransformtoeachnode } from '../elementtransformer';
import { translatename, pixelunit } from '../animations/styleconstants';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { elementrefargs } from '../utility/utility.data';

export const firstpagenumber = 1
export const websitespagenumber = 2
export const softwarepagenumber = 3
export const lastpagenumber = 4
export const pagename = 'page'
export const scrollitemclass = '.scroll-item'
export const contentidentifier = 'content'

export abstract class pagecomponent implements AfterViewInit  {
    private currentpageposition: number = 0

    @ViewChild(contentidentifier, elementrefargs)
    content: ElementRef

    private castcontent: SVGElement

    abstract contentlength: number

    ngAfterViewInit() {
      this.castcontent = <SVGElement>this.content.nativeElement      
    }
    
    onscroll(newY: number) {
      let percentagechange = newY / 100 * this.contentlength
      this.currentpageposition = this.currentpageposition - percentagechange
      let scrollitems = this.castcontent.querySelectorAll(scrollitemclass)
      applytransformtoeachnode(<NodeListOf<SVGElement>>scrollitems, translatename, `0${pixelunit}, ${this.currentpageposition}${pixelunit}`)
    }
}

export interface page {

}