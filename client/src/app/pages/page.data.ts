import { applytransformtoeachnode } from '../elementtranslator';
import { translatename, pixelunit } from '../animations/styleconstants';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

export const firstpagenumber = 1
export const websitespagenumber = 2
export const softwarepagenumber = 3
export const lastpagenumber = 4
export const pagename = 'page'
export const scrollitemclass = '.scroll-item'
export const contentidentifier = 'content'

export class pagecomponent implements AfterViewInit  {
    private currentpageposition: number = 0

    @ViewChild(contentidentifier, {static: true})
    content: ElementRef

    private castcontent: SVGElement

    ngAfterViewInit() {
      this.castcontent = <SVGElement>this.content.nativeElement      
    }
    
    onscroll(newY: number) {
        let potentialnewposition = this.currentpageposition - newY
        this.currentpageposition = potentialnewposition        
        let scrollitems = this.castcontent.querySelectorAll(scrollitemclass)
        applytransformtoeachnode(<NodeListOf<SVGElement>>scrollitems, translatename, `0${pixelunit}, ${this.currentpageposition}${pixelunit}`)
      }
}

export interface page {

}