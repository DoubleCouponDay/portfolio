import { animation, animate, style, stagger, transition, state, trigger, query, AnimationAnimateMetadata } from '@angular/animations';
import { spanname, defaultstate } from './animation.data';

const wavedistance = 20
export const topstatename = 'translatedtop'
export const botstatename = 'translatedbot'
const topstatevalue = `translate(0px, 0px)`
const botstatevalue = `translate(0px, ${wavedistance}px)`
const delay = 200
export const slidetime = 2000

function gettransformstyle(statevalue: string): AnimationAnimateMetadata {
    return animate(
        `${slidetime}ms`,
        style({
            transform: statevalue
        })
    )
}

export const slideinfinite = trigger(
    'slideinfinite',
    [
        state(topstatename, style({transform: topstatevalue})),
        state(botstatename, style({transform: botstatevalue})),
        transition(`${topstatename} => ${botstatename}`, 
            query(spanname, [
                stagger(delay, gettransformstyle(botstatevalue))
            ])
        ),
        transition(`${botstatename} => ${topstatename}`, 
            query(spanname, [
                stagger(delay, gettransformstyle(topstatevalue))
            ])
        ),
    ]
)
