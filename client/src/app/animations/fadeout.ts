import { AnimationTriggerMetadata, trigger, transition, animate, style, query, animation } from '@angular/animations'
import { inputopacityname } from './styleconstants';

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

export const togglefade = animation(
    animate(
        '3s',
        style({
            opacity: `{{ ${inputopacityname} }}`
        })
    )
)