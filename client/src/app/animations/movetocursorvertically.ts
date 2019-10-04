import { animation, animate, state, trigger, style, query, AnimationStyleMetadata, useAnimation } from '@angular/animations';

export const inputtransformname = 'inputtransform'

const movetocursorvertically = animation(
    animate(
        "0s",
        style({
            transform: `{{ ${inputtransformname} }}`
        })
    )
)

export const resetposition = animation(
    animate(
        "0.5s ease-out",
        style({
            transform: "translate(0px, 0px)"
        })
    )
)
export default movetocursorvertically