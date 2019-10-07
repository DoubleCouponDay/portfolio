import { OnDestroy } from '@angular/core';
import { touchstartname, touchmovename, touchendname } from './utility.data';

export function isnullorundefined(input: any): boolean {
    return input === null || input === undefined
}

export function ismobile() {
    let matcher = new RegExp(/(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i)
    return matcher.test(navigator.userAgent)
}

export function disabletouchevents() {
    let preventdefault = (event: TouchEvent) => {
        event.preventDefault()
    }
    document.addEventListener(touchstartname, preventdefault)
    document.addEventListener(touchmovename, preventdefault)
    document.addEventListener(touchendname, preventdefault)
}