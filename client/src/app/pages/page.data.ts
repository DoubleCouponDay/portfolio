import { applytransformtoeachnode } from '../elementtranslator';
import { translatename, pixelunit } from '../animations/styleconstants';

export const firstpagenumber = 1
export const websitespagenumber = 2
export const softwarepagenumber = 3
export const lastpagenumber = 4
export const pagename = 'page'
export const scrollitemclass = '.scroll-item'

export class pagecomponent {
    private currentpageposition: number = 0
    
    onscroll(newY: number) {
        let potentialnewposition = this.currentpageposition - newY
        this.currentpageposition = potentialnewposition
        let scrollitems = document.querySelectorAll(scrollitemclass)
        applytransformtoeachnode(scrollitems, translatename, `0${pixelunit}, ${this.currentpageposition}${pixelunit}`)
      }
}