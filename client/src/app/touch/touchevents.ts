import { touchstartname, touchmovename, touchendname, mousedownname, mouseovername, mouseupname } from './touch.data';
import { OnDestroy } from '@angular/core';
import {snackbarservice} from '../services/snackbar.service';

const listenoptions: AddEventListenerOptions = {
    passive: false //prevents chrome from ignoring scroll disables    
}

export class touchevents implements OnDestroy {
    private elements: SVGElement[]

    private currentY = 0
    private changeinY = 0

    private buttonheld = false

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
        let touch = event.touches[0]

        switch(event.type) {
            case touchstartname:
                this.buttonheld = true
                convertedtype = mousedownname      
                document.addEventListener(touchmovename, this.onmoveoverride, listenoptions) //because a drag action may leave the boundaries of the element
                document.addEventListener(touchendname, this.onreleaseoverride, listenoptions)
                this.currentY = touch.clientY
                break

            case touchmovename:
                if(this.buttonheld === false) {
                    break
                }
                convertedtype = mouseovername

                if(this.currentY !== 0) {
                    this.changeinY = touch.clientY - this.currentY
                }                
                this.currentY = touch.clientY
                event.preventDefault()
                event.stopPropagation()
                break
            
            case touchendname:
                this.buttonheld = false
                convertedtype = mouseupname                
                document.removeEventListener(touchmovename, this.onmoveoverride, listenoptions)
                document.removeEventListener(touchendname, this.onreleaseoverride, listenoptions)
                break
        }

        let mappedevent = new MouseEvent(convertedtype, {
            movementY: this.changeinY,
            relatedTarget: event.target
        })

        callback(mappedevent)
    }

    ngOnDestroy(): void {
        this.elements.forEach((item) => {
            item.removeEventListener(touchstartname, this.ontouchoverride)
            item.removeEventListener(touchmovename, this.onmoveoverride)
            item.removeEventListener(touchendname, this.onreleaseoverride)
        })
    }
}