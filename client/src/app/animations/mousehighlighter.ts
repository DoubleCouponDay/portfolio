import { colourhighlight } from './styleconstants';
import { elementAt } from 'rxjs/operators';

export class mousehighlighter {
    private previouscolour: string = ""

    applyhighlight(element: HTMLElement | SVGElement) {
        this.previouscolour = element.style.fill
        element.style.fill = colourhighlight
    }
    
    resethighlight(element: HTMLElement | SVGElement) {
        element.style.fill = this.previouscolour
    }
}
