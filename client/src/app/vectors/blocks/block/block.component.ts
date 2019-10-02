import { Component, OnInit } from '@angular/core';
import { minboxtranslation, biggestshadow, maxboxtranslation, smallestshadow, shadowname } from '../blocks.data';
import { scalename } from 'src/app/animations/styleconstants';
import { nooccurrence } from 'src/app/global.data';

@Component({
  selector: 'g[app-block]',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockComponent {
  private translationyfield: number = 0

  get translationy() {
      return this.translationyfield
  }

  /**boxname must be in the format "box-group1", "box-group2" */
  constructor(private boxgroupname: string, initialy: number) {
      this.translationyfield = initialy
      this.chooseshadow()
  }



  /** returns whether the block is at the threshold of activating a page transition */
  addmovement(value: number): boolean {
      this.translationyfield += value
      
      if(value === 0) {
          return false
      }

      else if(this.translationyfield < minboxtranslation) {
          this.translationyfield = minboxtranslation
          this.setshadow(biggestshadow)
          return false
      }
  
      else if(this.translationyfield > maxboxtranslation) {
          this.translationyfield = maxboxtranslation
          this.setshadow(smallestshadow)
          return true
      }
      this.chooseshadow()
      return false
  }

  private chooseshadow() {
      let shadownumber = Math.floor(this.translationyfield / maxboxtranslation * smallestshadow) + 1
      this.setshadow(shadownumber)
  }

  private setshadow(shadownumber: number) {
      let boxespaths = document.querySelectorAll(`#${this.boxgroupname} path`)  
      let chosenshadow = <SVGElement>document.querySelector(`#${this.boxgroupname} #${shadowname}${shadownumber}`)

      if(chosenshadow === null) {
          throw new Error('shadow is null')
      }
      chosenshadow.style.transform = `${scalename}(1)`        

      boxespaths.forEach((currentelement) => {
          if(currentelement.id.indexOf(shadowname) !== nooccurrence &&
              currentelement.id !== `${shadowname}${shadownumber}`) { //assuming the shadows are in order
              let htmlelement = <SVGElement>currentelement
              htmlelement.style.transform = `${scalename}(0)`
          }
      })
  }
}