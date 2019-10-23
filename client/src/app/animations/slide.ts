import { animation, animate, style, stagger, transition, state, trigger, query } from '@angular/animations';
import { spanname, defaultstate } from './animation.data';

const slidedistance = 15
export const topstatename = 'translatedtop'
export const botstatename = 'translatedbot'
const topstatevalue = `translate(0px, 0px)`
const botstatevalue = `translate(0px, ${slidedistance}px)`
export const slidetime = 1500

export function gettransformstyle(statevalue: string) {
    return animate(
        `${slidetime}ms`,
        style({
            transform: statevalue
        })
    )
}

export enum slidestate {
    translatedbot = '1',
    translatedtop = '2'
}

export const slideinfinite = trigger(
    'slideinfinite', [        
        state(slidestate.translatedtop, style({transform: topstatevalue})),
        state(slidestate.translatedbot, style({transform: botstatevalue})),
        transition(`${slidestate.translatedtop} => ${slidestate.translatedbot}`,   
            gettransformstyle(botstatevalue)           
        ),
        transition(`${slidestate.translatedbot} => ${slidestate.translatedtop}`, 
            gettransformstyle(topstatevalue)
        )
    ]
)

