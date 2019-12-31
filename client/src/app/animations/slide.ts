import { animation, animate, style, stagger, transition, state, trigger, query } from '@angular/animations';
import { inputtimename } from './animation.data';

export const slidedistance = 15
export const topstatename = 'translatedtop'
export const botstatename = 'translatedbot'
export const topstatevalue = `translate(0px, 0px)`
export const botstatevalue = `translate(0px, ${slidedistance}px)`
export const animatetime = 2000
export const swaptime = 100

export function gettransformstyle(statevalue: string) {
    return animate(
        `{{ ${inputtimename} }}ms`,
        style({
            transform: statevalue
        })
    )
}

export enum slidestate {
    translatingbot = 'bot',
    translatingtop = 'top'
}

