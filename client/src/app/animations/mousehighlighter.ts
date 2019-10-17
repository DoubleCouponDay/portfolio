import { colourhighlight } from './animation.data';
import { elementAt } from 'rxjs/operators';
import { isnullorundefined } from '../utility/utilities';

export class mousehighlighter {
    private previouselement: HTMLElement | SVGElement

    constructor(private defaultcolour: string) {

    }

    applyhighlight(element: HTMLElement | SVGElement) {
        element.style.fill = colourhighlight
        this.previouselement = element
    }
    
    /** resets previous element if none given */
    resethighlight(element?: HTMLElement | SVGElement) {
        let correctelement = isnullorundefined(element) ? this.previouselement : element

        if(isnullorundefined(correctelement) === true) {
            return
        }
        correctelement.style.fill = this.defaultcolour
    }
}
