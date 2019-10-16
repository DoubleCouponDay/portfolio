import { AnimationTriggerMetadata, trigger, transition, animate, style, query, animation } from '@angular/animations'
import { inputopacityname, inputtimename } from './styleconstants';
import { smoothtime } from './movetocursorvertically';

export const fadeout = trigger(
    "fadeout", [
        transition(
            ":leave",
            query(
                "*",
                animate(
                    "1s",
                    style({
                        opacity: 0
                    })
                )
            )
        )
    ]
)

/** parameteres: inputopacity */
export const togglefade = animation(
    animate(
        `${smoothtime}ms`,
        style({
            opacity: `{{ ${inputopacityname} }}`
        })
    )
)