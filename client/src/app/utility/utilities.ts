import { OnDestroy } from '@angular/core';
import { touchstartname, touchmovename, touchendname } from '../touch/touch.data';

export const passiveeventargs: AddEventListenerOptions = {
    passive: false //prevents chrome from ignoring scroll disables    
}

export function isnullorundefined(input: any): boolean {
    return input === null || input === undefined
}

export function ismobile() {
    let matcher = new RegExp(/(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i)
    return matcher.test(navigator.userAgent)
}