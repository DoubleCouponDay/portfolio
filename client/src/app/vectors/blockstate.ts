import { ElementRef, OnInit } from '@angular/core';
import { minboxtranslation, maxboxtranslation, biggestshadow, smallestshadow, shadowname, nooccurrence } from './constants';
import { assertNotNull } from '@angular/compiler/src/output/output_ast';

//should be constructed after views have initialized
export class blockstate {
    private translationyfield: number = 0

    get translationy() {
        return this.translationyfield
    }

    /**boxname must be in the format "box1", "box2" */
    constructor(private boxname: string) {
        
    }

    /** returns whether the block is at the threshold of activating a page transition */
    addmovement(value: number): boolean {
        let possiblesum = this.translationyfield + value

        if(possiblesum < minboxtranslation) {
            this.translationyfield = minboxtranslation
            this.setshadow(biggestshadow)
        }
    
        else if(possiblesum > maxboxtranslation) {
            this.translationyfield = maxboxtranslation
            this.setshadow(smallestshadow)
            return true
        }

        else {
            this.translationyfield = possiblesum
            this.chooseshadow()
        }
        return false
    }

    private chooseshadow() {
        let shadownumber = Math.floor(this.translationyfield / maxboxtranslation * smallestshadow) + 1
        this.setshadow(shadownumber)
    }

    private setshadow(shadownumber: number) {
        let boxespaths = document.querySelectorAll(`#${this.boxname} path`)  
        let chosenshadow = document.querySelector(`#${this.boxname} #${shadowname}${shadownumber}`) as SVGElement

        if(chosenshadow === null) {
            throw new Error('shadow is null')
        }
        chosenshadow.style.transform = 'scale(1)'         

        boxespaths.forEach((currentelement) => {
            if(currentelement.id.indexOf(shadowname) !== nooccurrence &&
                currentelement.id !== `${shadowname}${shadownumber}`) { //assuming the shadows are in order
                let htmlelement = currentelement as SVGElement
                htmlelement.style.transform = 'scale(0)'
            }
        })
    }
}