import { touchstartname, touchmovename, touchendname, mousedownname, mouseovername, mouseupname } from './touch.data';
import { OnDestroy } from '@angular/core';
import { passiveeventargs } from '../utility/utilities';


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
            item.addEventListener(touchstartname, this.ontouchoverride, passiveeventargs)
            item.addEventListener(touchmovename, this.onmoveoverride, passiveeventargs)
            item.addEventListener(touchendname, this.onreleaseoverride, passiveeventargs)
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
                document.addEventListener(touchmovename, this.onmoveoverride, passiveeventargs) //because a drag action may leave the boundaries of the element
                document.addEventListener(touchendname, this.onreleaseoverride, passiveeventargs)
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
                break
            
            case touchendname:
                this.buttonheld = false
                convertedtype = mouseupname                
                document.removeEventListener(touchmovename, this.onmoveoverride, passiveeventargs)
                document.removeEventListener(touchendname, this.onreleaseoverride, passiveeventargs)
                break
        }

        let mappedevent = new MouseEvent(convertedtype, {
            movementY: this.changeinY,
            relatedTarget: event.target
        })

        setTimeout(() => {
            callback(mappedevent)
        })        
    }

    ngOnDestroy(): void {
        this.elements.forEach((item) => {
            item.removeEventListener(touchstartname, this.ontouchoverride)
            item.removeEventListener(touchmovename, this.onmoveoverride)
            item.removeEventListener(touchendname, this.onreleaseoverride)
        })
    }
}