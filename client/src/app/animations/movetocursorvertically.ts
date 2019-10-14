import { animation, animate, state, trigger, style, query, AnimationStyleMetadata, useAnimation } from '@angular/animations';
import { inputtimename } from './styleconstants';

export const inputtransformname = 'inputtransform'
export const smoothtime = 500

/** parameters: inputtime, inputtransform */
export const movetocursorvertically = animation(
    animate(
        `{{ ${inputtimename} }}ms`,
        style({
            transform: `{{ ${inputtransformname} }}`
        })
    )
)

export const resetposition = animation(
    animate(
        `${smoothtime}ms ease-out`,
        style({
            transform: "translate(0px, 0px)"
        })
    )
)