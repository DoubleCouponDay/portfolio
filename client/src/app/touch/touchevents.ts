import { touchstartname, touchmovename, touchendname, mousedownname, mouseovername, mouseupname } from './touch.data';
import { OnDestroy } from '@angular/core';

const listenoptions: AddEventListenerOptions = {
    passive: false //prevents chrome from ignoring scroll disables
}

export class touchevents implements OnDestroy {
    private elements: SVGElement[]

    private currentY = 0
    private changeinY = 0

    constructor(private ontouch: (event: MouseEvent) => void,
        private onmove: (event: MouseEvent) => void,
        private onrelease: (event: MouseEvent) => void,
        ...interactables: SVGElement[]) {
        this.elements = interactables

        interactables.forEach((item) => {
            item.addEventListener(touchstartname, this.ontouchoverride, listenoptions)
            item.addEventListener(touchmovename, this.onmoveoverride, listenoptions)
            item.addEventListener(touchendname, this.onreleaseoverride, listenoptions)
        })
    }

    private ontouchoverride = (event: TouchEvent) => {
        this.onevent(event, this.ontouch)
    }

    private onmoveoverride = (event: TouchEvent) => {
        this.onevent(event, this.onmove)
    }

    private onreleaseoverride = (event: TouchEvent) => {
        this.onevent(event, this.onrelease)
    }

    private onevent = (event: TouchEvent, callback: (event: MouseEvent) => void) => {
        let convertedtype: string
        
        switch(event.type) {
            case touchstartname:
                convertedtype = mousedownname
                document.addEventListener(touchmovename, this.onmoveoverride, listenoptions)
                document.addEventListener(touchendname, this.onreleaseoverride, listenoptions)
                break

            case touchmovename:
                convertedtype = mouseovername

                if(this.currentY !== 0) {
                    this.changeinY = event.touches[0].clientY - this.currentY
                }                
                this.currentY = event.touches[0].clientY
                break
            
            case touchendname:
                convertedtype = mouseupname
                document.removeEventListener(touchmovename, this.onmoveoverride, listenoptions)
                document.removeEventListener(touchendname, this.onreleaseoverride, listenoptions)
                break
        }
        
        event.preventDefault()
        event.stopImmediatePropagation()

        let mappedevent = new MouseEvent(convertedtype, {
            movementY: this.changeinY,
            relatedTarget: event.target
        })
        callback(mappedevent)
    }

    privateonglobal(event: TouchEvent) {

    }

    ngOnDestroy(): void {
        this.elements.forEach((item) => {
            item.removeEventListener(touchstartname, this.ontouchoverride)
            item.removeEventListener(touchmovename, this.onmoveoverride)
            item.removeEventListener(touchendname, this.onreleaseoverride)
        })
    }
}