import { touchstartname, touchmovename, touchendname, mousedownname, mouseovername, mouseupname } from './touch.data';
import { OnDestroy } from '@angular/core';


export class touchevents implements OnDestroy {
    private elements: SVGElement[]

    private changeinY = 0
    private touchheld = false

    constructor(private ontouch: (event: MouseEvent) => void,
        private onmove: (event: MouseEvent) => void,
        private onrelease: (event: MouseEvent) => void,
        ...interactables: SVGElement[]) {
        this.elements = interactables

        let listenoptions: AddEventListenerOptions = {
            passive: false //prevents chrome from ignoring scroll disables
        }

        interactables.forEach((item) => {
            item.addEventListener(touchstartname, (event) => { this.onevent(event, ontouch)}, listenoptions)
            item.addEventListener(touchmovename, (event) => { this.onevent(event, onmove)}, listenoptions)
            item.addEventListener(touchendname, (event) => { this.onevent(event, onrelease)}, listenoptions)
        })
    }

    private onevent = (event: TouchEvent, callback: (event: MouseEvent) => void) => {
        let convertedtype: string
        
        switch(event.type) {
            case touchstartname:
                convertedtype = mousedownname
                this.touchheld = true
                break

            case touchmovename:
                convertedtype = mouseovername
                break
            
            case touchendname:
                convertedtype = mouseupname
                this.touchheld = false
                break
        }
        
        event.preventDefault()
        let transformedevent = new MouseEvent(convertedtype)
        transformedevent
        callback(event)
    }

    ngOnDestroy(): void {
        this.elements.forEach((item) => {
            item.removeEventListener(touchstartname, this.ontouch)
            item.removeEventListener(touchmovename, this.onmove)
            item.removeEventListener(touchendname, this.onrelease)
        })
    }
}